import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart as BarChartIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

export function Analytics({ isOpen, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('tasks');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, pointsResponse] = await Promise.all([
          axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json'),
          axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/points.json')
        ]);

        const tasksData = tasksResponse.data ? Object.keys(tasksResponse.data).map(key => ({
          id: key,
          ...tasksResponse.data[key]
        })) : [];

        const pointsData = pointsResponse.data ? Object.keys(pointsResponse.data).map(key => ({
          id: key,
          ...pointsResponse.data[key]
        })) : [];

        setTasks(tasksData);
        setPoints(pointsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTaskStats = () => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const avgTime = tasks
      .filter(task => task.estimatedTime)
      .reduce((acc, task) => acc + parseFloat(task.estimatedTime), 0) / tasks.length || 0;

    const efficiency = completed > 0 ? (completed / (completed + pending)) * 100 : 0;

    return { completed, pending, avgTime, efficiency };
  };

  const getTaskDistribution = () => {
    const distribution = tasks.reduce((acc, task) => {
      acc[task.taskType] = (acc[task.taskType] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value: (value / tasks.length) * 100
    }));
  };

  const getPerformanceData = () => {
    const now = new Date();
    const timeframes = {
      week: 7,
      month: 30,
      quarter: 90
    };

    const days = timeframes[selectedTimeframe];
    const performanceData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayTasks = tasks.filter(task => 
        new Date(task.timestamp).toDateString() === date.toDateString()
      );

      performanceData.unshift({
        name: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString(),
        completed: dayTasks.filter(task => task.status === 'completed').length,
        pending: dayTasks.filter(task => task.status === 'pending').length
      });
    }

    return performanceData;
  };

  const getTopPerformers = () => {
    const userPoints = points.reduce((acc, point) => {
      acc[point.userName] = (acc[point.userName] || 0) + point.points;
      return acc;
    }, {});

    return Object.entries(userPoints)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };

  const stats = getTaskStats();

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-screen p-4">
        <div className="container mx-auto">
          <div className="bg-gray-600/20 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <BarChartIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Team Analytics Dashboard</h2>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  className="bg-gray-800/40 text-white rounded-lg px-4 py-2 border border-gray-700/50"
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                </select>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading analytics data...</div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Completed Tasks</p>
                        <p className="text-2xl font-bold text-white">{stats.completed}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Pending Tasks</p>
                        <p className="text-2xl font-bold text-white">{stats.pending}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Avg. Completion Time</p>
                        <p className="text-2xl font-bold text-white">
                          {stats.avgTime.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Efficiency Rate</p>
                        <p className="text-2xl font-bold text-white">
                          {stats.efficiency.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Trend */}
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getPerformanceData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '0.5rem',
                            }}
                          />
                          <Bar dataKey="completed" fill="#3B82F6" stackId="a" name="Completed" />
                          <Bar dataKey="pending" fill="#EC4899" stackId="a" name="Pending" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Task Distribution */}
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Task Distribution</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getTaskDistribution()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {getTaskDistribution().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '0.5rem',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {getTaskDistribution().map((entry, index) => (
                        <div key={entry.name} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm text-gray-400">
                            {entry.name} ({entry.value.toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Performers Table */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-700/50">
                          <th className="pb-3 text-gray-400">Employee</th>
                          <th className="pb-3 text-gray-400">Points</th>
                          <th className="pb-3 text-gray-400">Tasks Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getTopPerformers().map((performer, index) => (
                          <tr key={performer.name} className="border-b border-gray-700/50">
                            <td className="py-3 text-white">{performer.name}</td>
                            <td className="py-3 text-white">{performer.value}</td>
                            <td className="py-3 text-white">
                              {tasks.filter(task => 
                                task.assignedTo === performer.name && task.status === 'completed'
                              ).length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}