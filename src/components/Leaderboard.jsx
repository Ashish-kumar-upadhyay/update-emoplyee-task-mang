import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import axios from 'axios';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('week'); // week, month, allTime

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/points.json');
      if (response.data) {
        // Convert points data to array and group by user
        const pointsData = Object.values(response.data);
        const userPoints = pointsData.reduce((acc, point) => {
          const date = new Date(point.timestamp);
          const now = new Date();
          
          // Filter based on timeframe
          if (
            (timeframe === 'week' && date > new Date(now - 7 * 24 * 60 * 60 * 1000)) ||
            (timeframe === 'month' && date > new Date(now - 30 * 24 * 60 * 60 * 1000)) ||
            timeframe === 'allTime'
          ) {
            acc[point.userName] = (acc[point.userName] || 0) + point.points;
          }
          return acc;
        }, {});

        // Convert to array and sort
        const sortedLeaderboard = Object.entries(userPoints)
          .map(([name, points]) => ({ name, points }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 5); // Top 5 users

        setLeaderboard(sortedLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  return (
    <div className="bg-gray-700/40 p-6 rounded-2xl shadow-2xl border-2 border-transparent hover:border-yellow-400/40 backdrop-blur-xl transition-all duration-300 animate-fade-in hover:scale-[1.03]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl text-white font-extrabold flex items-center font-[Poppins,sans-serif] tracking-wide drop-shadow-md">
          <Trophy className="w-7 h-7 text-yellow-400 mr-2 animate-bounce" />
          Leaderboard
        </h3>
        <select
          className="px-3 py-2 rounded-md border-2 border-blue-400/30 bg-gray-400/20 text-white font-bold shadow-sm focus:border-pink-400/40 transition-all"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="allTime">All Time</option>
        </select>
      </div>
      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div
            key={user.name}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-700/80 shadow-lg border border-blue-400/10 hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300 animate-fade-in"
          >
            <div className="flex items-center">
              {index === 0 ? (
                <Award className="w-7 h-7 text-yellow-400 mr-2 animate-pulse" />
              ) : index === 1 ? (
                <Award className="w-7 h-7 text-gray-300 mr-2 animate-pulse" />
              ) : index === 2 ? (
                <Award className="w-7 h-7 text-amber-600 mr-2 animate-pulse" />
              ) : (
                <Star className="w-7 h-7 text-blue-400 mr-2 animate-pulse" />
              )}
              <span className="font-bold text-white text-lg tracking-wide font-[Poppins,sans-serif] drop-shadow-md">{user.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-yellow-300 text-xl drop-shadow-md animate-navbar-avatar">{user.points}</span>
              <span className="text-sm text-gray-300 ml-1">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}