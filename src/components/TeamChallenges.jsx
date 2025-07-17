import React, { useState, useEffect } from 'react';
import { Target, Users, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export function TeamChallenges({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    fetchChallenges();
  }, [user.name]);

  const fetchChallenges = async () => {
    try {
      // Fetch tasks to calculate progress
      const tasksResponse = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json');
      
      if (tasksResponse.data) {
        const tasks = Object.values(tasksResponse.data);
        const weekStart = new Date();
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        // Calculate progress for different challenges
        const adHocTasksCompleted = tasks.filter(task => 
          task.status === 'completed' &&
          task.taskType === 'Ad Hoc' &&
          new Date(task.completedAt) > weekStart
        ).length;

        const highPriorityCompleted = tasks.filter(task => 
          task.status === 'completed' &&
          task.priority === 'high' &&
          new Date(task.completedAt) > weekStart
        ).length;

        // Define active challenges
        const activeChallenges = [
          {
            id: 1,
            title: 'Ad Hoc Heroes',
            description: 'Complete 5 Ad Hoc tasks this week',
            target: 5,
            current: adHocTasksCompleted,
            icon: <Target className="w-6 h-6 text-purple-500" />,
            reward: '300 bonus points'
          },
          {
            id: 2,
            title: 'Priority Masters',
            description: 'Complete 3 high-priority tasks this week',
            target: 3,
            current: highPriorityCompleted,
            icon: <Users className="w-6 h-6 text-blue-500" />,
            reward: '200 bonus points'
          }
        ];

        setChallenges(activeChallenges);
        setProgress({
          adHocTasks: adHocTasksCompleted,
          highPriority: highPriorityCompleted
        });
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  return (
    <div className="bg-gray-700/40 text-white p-6 rounded-2xl shadow-2xl border-2 border-transparent hover:border-blue-400/40 backdrop-blur-xl transition-all duration-300 animate-fade-in hover:scale-[1.03]">
      <div className="flex items-center mb-6">
        <Target className="w-7 h-7 text-blue-400 mr-2 animate-bounce" />
        <h3 className="text-2xl font-extrabold font-[Poppins,sans-serif] tracking-wide drop-shadow-md">Team Challenges</h3>
      </div>
      <div className="space-y-6">
        {challenges.map(challenge => (
          <div key={challenge.id} className="rounded-xl p-5 bg-gradient-to-br from-gray-800/80 to-gray-700/80 shadow-lg border border-blue-400/10 hover:scale-105 hover:shadow-pink-400/30 transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {challenge.icon}
                <h4 className="text-lg font-bold ml-2 font-[Poppins,sans-serif] tracking-wide">{challenge.title}</h4>
              </div>
              {challenge.current >= challenge.target && (
                <CheckCircle2 className="w-7 h-7 text-green-400 animate-bounce" />
              )}
            </div>
            <p className="text-gray-200 mb-3 font-mono">{challenge.description}</p>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-100 mb-1">
                <span>Progress</span>
                <span>{challenge.current}/{challenge.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full h-2 transition-all duration-700 animate-navbar-avatar"
                  style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-200 mt-2">
              <span className="font-medium">Reward:</span> {challenge.reward}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}