import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, Target, Trophy, Calendar, Zap } from 'lucide-react';
import axios from 'axios';

export function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [user.name]);

  const fetchNotifications = async () => {
    try {
      const tasksResponse = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json');
      const pointsResponse = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/points.json');

      if (tasksResponse.data && pointsResponse.data) {
        const tasks = Object.values(tasksResponse.data).filter(task => task.assignedTo === user.name);
        const points = Object.values(pointsResponse.data).filter(point => point.userName === user.name);

        const newNotifications = [];

        // Deadline Notifications
        const urgentTasks = tasks.filter(task => 
          task.status === 'pending' && 
          task.priority === 'urgent' &&
          new Date(task.timestamp) < new Date(Date.now() - 24 * 60 * 60 * 1000)
        );

        if (urgentTasks.length > 0) {
          newNotifications.push({
            type: 'urgent',
            message: `You have ${urgentTasks.length} urgent tasks that require immediate attention!`,
            icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
            details: urgentTasks.map(task => task.taskName).join(', ')
          });
        }

        const upcomingDeadlines = tasks.filter(task => 
          task.status === 'pending' && 
          new Date(task.timestamp) < new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        );

        if (upcomingDeadlines.length > 0) {
          newNotifications.push({
            type: 'deadline',
            message: `${upcomingDeadlines.length} tasks are approaching their deadlines!`,
            icon: <Clock className="w-5 h-5 text-orange-500" />,
            details: upcomingDeadlines.map(task => task.taskName).join(', ')
          });
        }

        // Performance Metrics
        const last7Days = points.filter(point => 
          new Date(point.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        const weeklyPoints = last7Days.reduce((sum, point) => sum + point.points, 0);
        const completedTasks = last7Days.length;

        // Productivity Alerts
        if (weeklyPoints < 200) {
          newNotifications.push({
            type: 'performance',
            message: 'Your productivity this week is below target.',
            icon: <Target className="w-5 h-5 text-red-500" />,
            details: 'Tips: Break down tasks into smaller chunks, use time management techniques, or reach out to your team lead for guidance.'
          });
        } else if (weeklyPoints > 500) {
          newNotifications.push({
            type: 'achievement',
            message: 'Outstanding performance this week! 🌟',
            icon: <Trophy className="w-5 h-5 text-yellow-500" />,
            details: `You've earned ${weeklyPoints} points and completed ${completedTasks} tasks!`
          });
        }

        // Task Streak
        const consecutiveDays = calculateConsecutiveDays(points);
        if (consecutiveDays >= 3) {
          newNotifications.push({
            type: 'streak',
            message: `${consecutiveDays} day productivity streak! 🔥`,
            icon: <Zap className="w-5 h-5 text-purple-500" />,
            details: 'Keep up the momentum!'
          });
        }

        setNotifications(newNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const calculateConsecutiveDays = (points) => {
    const dates = points
      .map(point => new Date(point.timestamp).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diffDays = Math.floor((current - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  if (notifications.length === 0) {
    return (
      <div className="fixed right-0 sm:right-auto sm:relative bg-gray-600/40 rounded-lg shadow-lg p-4 w-[calc(100vw-2rem)] sm:w-auto mx-4 sm:mx-0">
        <p className="text-gray-500 text-center">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="fixed right-0 sm:right-auto text-white sm:relative bg-gray-500/90 rounded-lg shadow-lg overflow-hidden w-[calc(100vw-2rem)] sm:w-auto mx-4 sm:mx-0">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-white mr-2" />
            <h3 className="text-lg p-2 font-semibold">Notifications</h3>
          </div>
          <span className="bg-yellow-400 text-gray-200 p-2 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {notifications.length} New
          </span>
        </div>
      </div>
      <div className="max-h-[calc(100vh-16rem)] sm:max-h-96 overflow-y-auto ">
        {notifications.map((notification, index) => (
          <div

            key={index}
            className={`p-4 border-b last:border-b-0 ${
              notification.type === 'achievement' ? 'bg-green-50' :
              notification.type === 'deadline' ? 'bg-orange-50' :
              notification.type === 'urgent' ? 'bg-red-50' :
              notification.type === 'streak' ? 'bg-purple-50' :
              'bg-gray-300/90'
            }`}
          >
            <div className="flex items-start ">
              {notification.icon}
              <div className="ml-3">
                <p className="text-gray-800 font-medium">{notification.message}</p>
                {notification.details && (
                  <p className="text-gray-600 text-sm mt-1">{notification.details}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}