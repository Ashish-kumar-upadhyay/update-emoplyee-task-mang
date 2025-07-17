import React, { useState, useEffect } from 'react';
import { LineChart, Clock, Award, Bell, Menu } from 'lucide-react';
import axios from 'axios';
import { Notifications } from './NotificationCenter';
import { Leaderboard } from './Leaderboard';
import { TeamChallenges } from './TeamChallenges';
import { LogOut } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function EmployeeView({ user }) {
  const location = useLocation();

  let dashboardTitle = "Dashboard";
  if (location.pathname === "/dashboard/employer") {
    dashboardTitle = "Employer Dashboard";
  } else if (location.pathname === "/dashboard/employee") {
    dashboardTitle = "Employee Dashboard";
  }

  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchPoints();
  }, [user.name]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json');
      if (response.data) {
        const tasksArray = Object.entries(response.data)
          .map(([id, task]) => ({ id, ...task }))
          .filter(task => task.assignedTo === user.name && task.status === 'pending')
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTasks(tasksArray);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchPoints = async () => {
    try {
      const response = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/points.json');
      if (response.data) {
        const userPoints = Object.values(response.data)
          .filter(point => point.userName === user.name)
          .reduce((total, point) => total + point.points, 0);
        setPoints(userPoints);
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const completeTask = async (task) => {
    try {
      await axios.patch(`https://hackathon-bf312-default-rtdb.firebaseio.com/tasks/${task.id}.json`, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });

      const pointsMap = {
        easy: 50,
        medium: 100,
        hard: 200
      };
      const earnedPoints = pointsMap[task.difficulty];

      await axios.post('https://hackathon-bf312-default-rtdb.firebaseio.com/points.json', {
        userName: user.name,
        points: earnedPoints,
        taskId: task.id,
        taskName: task.taskName,
        timestamp: new Date().toISOString()
      });

      fetchTasks();
      fetchPoints();
      toast.success(`🎉 Task completed! You earned ${earnedPoints} points!`, {
        icon: "🏆",
        style: {
          background: "linear-gradient(90deg, #1e3a8a 0%, #9333ea 100%)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem",
          boxShadow: "0 4px 24px #0004"
        }
      });
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const getTaskTypeColor = (type) => {
    const colors = {
      'BAU': 'bg-gray-100 text-gray-800',
      'Ad Hoc': 'bg-purple-100 text-purple-800',
      'Project-Based': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || colors.BAU;
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-500/30 dark:bg-gray-800/50 shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span
                className="ml-3 text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl animate-navbar-title-caveat font-[Caveat,cursive] tracking-wide"
              >
                {dashboardTitle}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                >
                  <Bell className="h-6 w-6 text-gray-200 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2">
                    <Notifications user={user} />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                />
                <span className="ml-2 text-gray-100">{user.name}</span>
              </div>
              <a
                href="/"
                className="flex items-center px-4 py-2 bg-transparent hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2 text-white/90 hover:text-gray-400 dark:hover:text-gray-300 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 p-6 bg-gray-100/10 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl animate-navbar-title-caveat font-[Caveat,cursive] mb-2">
            Welcome, {user.name}!
          </h2>
          <div className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 px-6 py-2 rounded-full shadow-2xl text-white font-bold text-lg animate-navbar-avatar border-2 border-white/20">
            Total Points: {points}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-600/20 text-white p-6 rounded-lg shadow-md backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">My Tasks</h3>
              {tasks.length === 0 ? (
                <p className="text-gray-300">No pending tasks</p>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border-2 border-transparent bg-gray-900/60 rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-400/40 hover:border-blue-400/40 animate-fade-in relative group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-xl text-white font-[Poppins,sans-serif] tracking-wide mb-1 animate-navbar-user">{task.taskName}</h4>
                          <p className="text-gray-300 mt-1 font-mono text-sm">{task.description}</p>
                        </div>
                        <button
                          onClick={() => completeTask(task)}
                          className="px-5 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:scale-110 hover:shadow-green-400/40 transition-all duration-200 animate-navbar-avatar"
                        >
                          Complete
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-sm font-bold shadow-sm ${getTaskTypeColor(task.taskType)}`}>{task.taskType}</span>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-sm font-bold shadow-sm ${getPriorityColor(task.priority)}`}>Priority: {task.priority}</span>
                        </div>
                        <div className="text-sm text-blue-200 font-semibold">
                          Difficulty: <span className="capitalize">{task.difficulty}</span>
                        </div>
                        <div className="text-sm text-blue-200 font-semibold">
                          Est. Time: {task.estimatedTime}h
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Assigned by: <span className="font-bold text-white">{task.assignedBy}</span> | Reference: <span className="font-mono text-blue-300">{task.reference}</span>
                      </div>
                      <div className="text-xs text-blue-300 mt-1">
                        Supporting Links: <a href={task.supportingLinks} className="underline hover:text-pink-400 transition-colors">{task.supportingLinks}</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Leaderboard />
            <TeamChallenges user={user} />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}