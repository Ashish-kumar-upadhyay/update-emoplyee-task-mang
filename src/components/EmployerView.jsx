import React, { useState, useEffect } from 'react';
import { Users, BarChart, FileText, X, UserPlus, ClipboardList, UserCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Analytics } from './Analytics';
import { Reports } from './Reports';
import { Notifications } from './NotificationCenter';
import { Bell, Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useLocation } from "react-router-dom";
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select, { components } from 'react-select';

// 2. Custom Option component for employee avatar
const EmployeeOption = (props) => {
  // Only show avatar for employee options (not 'all')
  const isEmployee = props.data.value !== 'all';
  return (
    <components.Option {...props}>
      {isEmployee && (
        <span
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#3b82f6',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 15,
            marginRight: 8,
          }}
        >
          {props.label.charAt(0).toUpperCase()}
        </span>
      )}
      {props.label}
    </components.Option>
  );
};

export function EmployerView({ user }) {
  const location = useLocation();

  let dashboardTitle = "Dashboard";
  if (location.pathname === "/dashboard/employer") {
    dashboardTitle = "Employer Dashboard";
  } else if (location.pathname === "/dashboard/employee") {
    dashboardTitle = "Employee Dashboard";
  }
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [points, setPoints] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);
  const [showViewEmployees, setShowViewEmployees] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: '',
    department: 'Development',
    email: '',
    joinDate: new Date().toISOString().split('T')[0]
  });
  const [taskData, setTaskData] = useState({
    taskName: '',
    description: '',
    assignedTo: '',
    taskType: 'BAU',
    difficulty: 'easy',
    priority: 'medium',
    estimatedTime: '',
    reference: '',
    supportingLinks: '',
    status: 'pending'
  });
  const [showAllAssignModal, setShowAllAssignModal] = useState(false);
  const [allAssignTaskData, setAllAssignTaskData] = useState({
    taskName: '',
    description: '',
    taskType: 'BAU',
    difficulty: 'easy',
    priority: 'medium',
    estimatedTime: '',
    reference: '',
    supportingLinks: '',
    status: 'pending'
  });
  const [isAssigningAll, setIsAssigningAll] = useState(false);
  const [showOnlyAllEmployeeTasks, setShowOnlyAllEmployeeTasks] = useState(false);
  const [taskViewMode, setTaskViewMode] = useState('individual'); // 'individual' or 'group'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [assignMode, setAssignMode] = useState('all'); // 'all' or 'selected'
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add this state to control modal and toggle
  const openAllEmployeeTasks = () => {
    setShowTaskList(true);
    setShowOnlyAllEmployeeTasks(true);
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/employees.json');
      if (response.data) {
        const employeeList = Object.entries(response.data).map(([id, data]) => ({
          id,
          ...data
        }));
        setEmployees(employeeList);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json');
      if (response.data) {
        const taskList = Object.entries(response.data).map(([id, data]) => ({
          id,
          ...data
        }));
        setTasks(taskList);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://hackathon-bf312-default-rtdb.firebaseio.com/employees.json', employeeData);
      toast.success('Employee added successfully!');
      setEmployeeData({
        name: '',
        department: 'Development',
        email: '',
        joinDate: new Date().toISOString().split('T')[0]
      });
      setShowEmployeeForm(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (taskData.assignedTo === 'all') {
        // Assign to all employees
        await Promise.all(employees.map(emp =>
          axios.post('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json', {
            ...taskData,
            assignedTo: emp.name,
            assignedBy: user.name,
            timestamp: new Date().toISOString()
          })
        ));
        toast.success('Task assigned to all employees!');
      } else if (taskData.assignedTo === 'selected') {
        // Assign to selected employees
        const selectedEmps = employees.filter(emp => selectedEmployees.map(e => e.value).includes(emp.name));
        if (selectedEmps.length === 0) {
          toast.error('Please select at least one employee!');
          setIsLoading(false);
          return;
        }
        await Promise.all(selectedEmps.map(emp =>
          axios.post('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json', {
            ...taskData,
            assignedTo: emp.name,
            assignedBy: user.name,
            timestamp: new Date().toISOString()
          })
        ));
        toast.success('Task assigned to selected employees!');
      } else {
        // Single employee
      await axios.post('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json', {
        ...taskData,
        assignedBy: user.name,
        timestamp: new Date().toISOString()
      });

      // 2. Send email via EmailJS
      const assignedEmployee = employees.find(emp => emp.name === taskData.assignedTo);
      if (assignedEmployee && assignedEmployee.email) {
          const assignedTime = new Date();
          const deadlineTime = new Date(assignedTime.getTime() + (parseFloat(taskData.estimatedTime) || 0) * 60 * 60 * 1000);
          const deadlineString = `${deadlineTime.toLocaleDateString()}, ${deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        await emailjs.send(
            'service_nm4p1zb', // Service ID
          'template_vu8f6y5', // Template ID
          {
              to_name: assignedEmployee.name,
              from_name: user.name,
            task_name: taskData.taskName,
              message: taskData.description,
              assigned_time: assignedTime.toLocaleString(),
              supporting_link: taskData.supportingLinks,
              employee_email: assignedEmployee.email,
              deadline: deadlineString, // Human-readable deadline
          },
          'm6hhXyhBQ1wkaKGVJ' // Public Key
        );
        toast.success('Task assigned and email sent successfully!');
      } else {
        toast.success('Task assigned, but employee email not found. Email not sent.');
        }
      }
      // ...reset form and fetch tasks...
      setTaskData({
        taskName: '',
        description: '',
        assignedTo: '',
        taskType: 'BAU',
        difficulty: 'easy',
        priority: 'medium',
        estimatedTime: '',
        reference: '',
        supportingLinks: '',
        status: 'pending'
      });
      setSelectedEmployees([]);
      setShowTaskForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error('Failed to assign task');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`https://hackathon-bf312-default-rtdb.firebaseio.com/tasks/${taskId}.json`, {
        status: newStatus
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  // Group tasks by taskName
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.taskName]) acc[task.taskName] = [];
    acc[task.taskName].push(task);
    return acc;
  }, {});

  // All Employee Tasks: taskName assigned to more than one employee
  const allEmployeeTasks = Object.entries(groupedTasks)
    .filter(([_, group]) => group.length > 1)
    .map(([taskName, group]) => ({
      id: group.map(t => t.id).join(','),
      taskName,
      assignedTo: group.map(t => t.assignedTo).join(', '),
      taskType: group[0].taskType,
      priority: group[0].priority,
      status: '', // status not meaningful for group
      group
    }));
  const allEmployeeTaskNames = new Set(allEmployeeTasks.map(t => t.taskName));
// Individual Tasks: taskName assigned to only one employee AND not in allEmployeeTasks
const individualTasks = Object.values(groupedTasks)
  .filter(group => group.length === 1 && !allEmployeeTaskNames.has(group[0].taskName))
  .flat();

  // Utility function to handle overlay click for closing modals
  const handleOverlayClick = (e, closeFn) => {
    if (e.target === e.currentTarget) {
      closeFn();
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`https://hackathon-bf312-default-rtdb.firebaseio.com/employees/${employeeId}.json`);
      setEmployees((prev) => prev.filter(emp => emp.id !== employeeId));
      toast.success('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  // Prepare options for react-select
  const employeeOptions = [
    { value: 'all', label: '👥 Assign to All Employees' },
    ...employees.map(emp => ({ value: emp.name, label: emp.name }))
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
    <div className="min-h-screen bg-gray-600/10 bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
        {/* Only show navbar if no modal is open */}
        {!showTaskList && !showTaskForm && !showEmployeeForm && !showAllAssignModal && !showViewEmployees && !showAnalytics && !showReports && (
      <nav className="bg-gray-500/30 shadow-md fixed w-full z-10">
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
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full shadow-md border-2 border-blue-400/40 animate-navbar-avatar"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                />
                <span className="ml-2 text-lg font-bold text-white tracking-wide animate-navbar-user font-[Poppins,sans-serif] drop-shadow-md">
                  {user.name}
                </span>
              </div>
              <a
                href="/"
                className="flex items-center px-4 py-2 bg-transparent hover:bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2 text-white/90 hover:text-gray-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </nav>
        )}

      <div className="min-h-screen bg-gradient-to-br from-gray-600/20 via-gray-900/20 to-gray-800/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Main Content */}
          <div className="space-y-8 pt-20">
            {/* Header Section */}
            <div className="bg-gray-600/20 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-xl flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome, {user.name}
              </h1>
              <p className="mt-2 text-gray-400">Manage your team and track performance</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Team Management Card */}
              <div
                onClick={() => setShowEmployeeForm(true)}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="h-full bg-gray-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/10">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white">Add Employee</h3>
                  </div>
                  <p className="text-gray-400">Add new team members to your organization</p>
                </div>
              </div>
              {/* Task Management Card */}
              <div
                onClick={() => setShowTaskForm(true)}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="h-full bg-gray-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 shadow-lg hover:shadow-green-500/10">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white">Assign Task</h3>
                  </div>
                  <p className="text-gray-400">Assign and manage team tasks</p>
                </div>
              </div>

              {/* Task List Card */}
              <div
                onClick={() => setShowTaskList(true)}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="h-full bg-gray-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 shadow-lg hover:shadow-yellow-500/10">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white pt-2">Task Tracking</h3>
                  </div>
                  <p className="text-gray-400">View and manage all assigned tasks</p>
                </div>
              </div>

              {/* View Employees Card */}
              <div
                onClick={() => setShowViewEmployees(true)}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="h-full bg-gray-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white">View Employees</h3>
                  </div>
                  <p className="text-gray-400">View and manage team members by department</p>
                </div>
              </div>

              {/* Analytics Card */}
              <div
                onClick={() => setShowAnalytics(true)}
                className="hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="h-full bg-gray-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 shadow-lg hover:shadow-purple-500/10">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                      <BarChart className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white">Analytics</h3>
                  </div>
                  <p className="text-gray-400">Track team performance and productivity metrics</p>
                </div>
              </div>

              {/* Reports Card */}
              <div
                onClick={() => setShowReports(true)}
                className="hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="h-full bg-gray-600/20 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-pink-500/50 shadow-lg hover:shadow-pink-500/10">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white">Reports</h3>
                  </div>
                  <p className="text-gray-400">Generate and view detailed team reports</p>
                </div>
              </div>
            </div>

            {/* Employee Form Modal */}
            {showEmployeeForm && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => handleOverlayClick(e, () => setShowEmployeeForm(false))}>
                <div className="bg-gray-600/20 backdrop-blur-md rounded-2xl w-full max-w-2xl border border-gray-700/50 shadow-2xl">
                  <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
                    <h2 className="text-2xl font-semibold text-white">Add New Employee</h2>
                    <button
                      onClick={() => setShowEmployeeForm(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleEmployeeSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Employee Name
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                            value={employeeData.name}
                            onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Department
                          </label>
                          <select
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                            value={employeeData.department}
                            onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
                          >
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                            value={employeeData.email}
                            onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Join Date
                          </label>
                          <input
                            type="date"
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                            value={employeeData.joinDate}
                            onChange={(e) => setEmployeeData({ ...employeeData, joinDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowEmployeeForm(false)}
                          className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        >
                          Add Employee
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* View Employees Modal */}
            {showViewEmployees && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => handleOverlayClick(e, () => setShowViewEmployees(false))}>
                  <div className="bg-gray-600/20 backdrop-blur-md rounded-2xl w-full max-w-4xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
                    <h2 className="text-2xl font-semibold text-white">Employees by Department</h2>
                    <button
                      onClick={() => setShowViewEmployees(false)}
                        className="text-gray-400 hover:text-white transition-colors text-xl"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                    <div className="p-6 overflow-y-auto max-h-[70vh] hide-scrollbar">
                      {Object.entries(
                        employees.reduce((acc, emp) => {
                          if (!acc[emp.department]) acc[emp.department] = [];
                          acc[emp.department].push(emp);
                          return acc;
                        }, {})
                      ).map(([dept, emps]) => (
                        <div key={dept} className="mb-8">
                          <div className="flex items-center mb-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                            <span className="text-lg font-bold text-white">{dept}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {emps.map(emp => (
                              <div
                                key={emp.id}
                                className="bg-gray-800/60 rounded-2xl p-3 flex flex-col items-center justify-between shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-blue-400/40 group animate-fade-in relative min-h-[170px] border-2 border-transparent hover:border-blue-400/40"
                              >
                                {/* Avatar/Profile Pic */}
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md mb-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-400/40 border-2 border-white/10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400"
                                  style={{
                                    color: '#fff',
                                    letterSpacing: '1px',
                                  }}
                                >
                                  {emp.name?.slice(0, 2).toUpperCase()}
                                </div>
                                {/* Details */}
                                <div className="flex flex-col items-center w-full">
                                  <div className="text-white font-bold text-base tracking-wide text-center mb-1 truncate w-full">{emp.name}</div>
                                  <div className="text-gray-300 text-xs max-w-[120px] truncate font-mono text-center w-full">{emp.email}</div>
                                  <div className="text-gray-400 text-xs mt-1 text-center">Joined: {emp.joinDate}</div>
                                </div>
                                {/* Delete Button at bottom right (floating) */}
                                <button
                                  onClick={() => { setShowDeleteConfirm(true); setEmployeeToDelete(emp); }}
                                  className="absolute bottom-2 right-2 text-red-400 hover:text-red-600 p-1 rounded-full transition-colors hover:scale-110 bg-white/10 shadow-md"
                                  title="Delete Employee"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Task Form Modal */}
            {showTaskForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm hide-scrollbar" onClick={e => handleOverlayClick(e, () => setShowTaskForm(false))}>
                  <div className="bg-gray-600/20 backdrop-blur-md rounded-2xl w-full max-w-2xl border border-gray-700/50 shadow-2xl relative overflow-hidden max-h-[80vh] overflow-y-auto hide-scrollbar">
                    {/* Decorative background */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-yellow-400/20 via-pink-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-yellow-400/10 rounded-full blur-2xl animate-pulse" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center p-8 border-b border-gray-700/50">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">Assign New Task</h2>
                    <button
                      onClick={() => setShowTaskForm(false)}
                          className="text-gray-400 hover:text-white transition-colors text-2xl"
                    >
                          <X className="w-7 h-7" />
                    </button>
                  </div>
                      <div className="p-8 pt-4">
                        <form onSubmit={handleSubmit} className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <label className="block text-sm font-bold text-blue-300 mb-2">Task Name</label>
                            <input
                              type="text"
                              required
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all"
                              value={taskData.taskName}
                                onChange={e => setTaskData({ ...taskData, taskName: e.target.value })}
                                placeholder="Enter task name"
                            />
                          </div>
                          {/* 2. Update the Assign To dropdown: */}
                          <div>
                              <label className="block text-sm font-bold text-blue-300 mb-2">Assign To</label>
                            <Select
                              isMulti
                              options={employeeOptions}
                              value={selectedEmployees}
                              onChange={selected => {
                                if (!selected) {
                                  setSelectedEmployees([]);
                                  setTaskData({ ...taskData, assignedTo: '' });
                                  return;
                                }
                                // If 'all' is selected, select all employees
                                if (selected.some(opt => opt.value === 'all')) {
                                  setSelectedEmployees(employeeOptions.slice(1)); // all employees except 'all'
                                  setTaskData({ ...taskData, assignedTo: 'all' });
                                } else {
                                  setSelectedEmployees(selected);
                                  if (selected.length === 1) {
                                    setTaskData({ ...taskData, assignedTo: selected[0].value });
                                  } else {
                                    setTaskData({ ...taskData, assignedTo: 'selected' });
                                  }
                                }
                              }}
                              placeholder="Select employees..."
                              className="react-select-container"
                              classNamePrefix="react-select"
                              closeMenuOnSelect={false}
                              components={{ Option: EmployeeOption }}
                            />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-blue-300 mb-2">Task Type</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white transition-all"
                              value={taskData.taskType}
                                onChange={e => setTaskData({ ...taskData, taskType: e.target.value })}
                            >
                              <option value="BAU">BAU (Business As Usual)</option>
                                <option value="Challenge">Challenge</option>
                              <option value="Ad Hoc">Ad Hoc</option>
                              <option value="Project-Based">Project-Based</option>
                            </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-blue-300 mb-2">Priority Level</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 text-white transition-all"
                              value={taskData.priority}
                                onChange={e => setTaskData({ ...taskData, priority: e.target.value })}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-blue-300 mb-2">Difficulty Level</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-white transition-all"
                              value={taskData.difficulty}
                                onChange={e => setTaskData({ ...taskData, difficulty: e.target.value })}
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-blue-300 mb-2">Estimated Time (hours)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-400 transition-all"
                              value={taskData.estimatedTime}
                                onChange={e => setTaskData({ ...taskData, estimatedTime: e.target.value })}
                                placeholder="e.g. 2"
                            />
                          </div>
                            <div>
                              <label className="block text-sm font-bold text-blue-300 mb-2">Reference (Manager/Colleague)</label>
                            <input
                              type="text"
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all"
                                value={taskData.reference}
                                onChange={e => setTaskData({ ...taskData, reference: e.target.value })}
                              placeholder="Name of manager or colleague who requested this task"
                            />
                          </div>
                          <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-blue-300 mb-2">Task Description</label>
                            <textarea
                              required
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all"
                              value={taskData.description}
                                onChange={e => setTaskData({ ...taskData, description: e.target.value })}
                                placeholder="Describe the task..."
                            />
                          </div>
                          <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-blue-300 mb-2">Supporting Links/Documents</label>
                              <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-400 transition-all"
                              value={taskData.supportingLinks}
                                onChange={e => setTaskData({ ...taskData, supportingLinks: e.target.value })}
                                placeholder="Add relevant links to documents, emails, or resources"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowTaskForm(false)}
                              className="px-8 py-3 text-gray-400 hover:text-white transition-colors rounded-xl font-semibold border border-gray-600 bg-gray-700/60 hover:bg-gray-600/80"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Please wait, assigning task and sending email...
                              </>
                            ) : (
                              "Assign Task to Employee"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task List Modal */}
            {showTaskList && (
              <div className="fixed inset-0 z-50 overflow-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => handleOverlayClick(e, () => setShowTaskList(false))}>
                <div className="bg-gray-600/20 backdrop-blur-md rounded-2xl w-full max-w-5xl h-[70vh] min-h-[400px] border border-gray-700/50 shadow-2xl relative overflow-hidden flex flex-col justify-start">
                  <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
                    <h2 className="text-2xl font-semibold text-white">Task Tracking</h2>
                    <button
                      onClick={() => setShowTaskList(false)}
                      className="text-gray-400 hover:text-white transition-colors text-xl"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {/* View Mode Buttons */}
                  <div className="flex justify-center gap-4 py-6">
                    <button
                      className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors border ${taskViewMode === 'individual' ? 'bg-blue-600/80 border-blue-400 text-white' : 'bg-gray-700/60 border-gray-600 text-blue-200 hover:bg-blue-700/60 hover:text-white'}`}
                      onClick={() => setTaskViewMode('individual')}
                    >
                      Individual Tasks
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors border ${taskViewMode === 'group' ? 'bg-yellow-500/90 border-yellow-400 text-gray-900' : 'bg-gray-700/60 border-gray-600 text-yellow-200 hover:bg-yellow-600/80 hover:text-white'}`}
                      onClick={() => setTaskViewMode('group')}
                    >
                      Group Tasks
                    </button>
                  </div>
                  {/* Table Section */}
                  <div className="p-6 pt-0 flex-1 overflow-y-auto hide-scrollbar">
                    {taskViewMode === 'individual' && (
                      <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                              <tr>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Task Name</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Assigned To</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Type</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Priority</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Status</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                              {individualTasks.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-gray-400 py-6 text-base">No individual tasks assigned.</td></tr>
                              ) : (
                                individualTasks.map((task) => (
                                  <tr key={task.id} className="border-b border-gray-700/50 hover:bg-gray-800/40 transition-all">
                                    <td className="p-3 text-white font-normal">{task.taskName}</td>
                                    <td className="p-3 text-gray-200">{task.assignedTo}</td>
                                    <td className="p-3 text-gray-200">{task.taskType}</td>
                                    <td className="p-3 text-gray-200">{task.priority}</td>
                              <td className="p-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    task.status === 'completed'
                                      ? 'bg-green-500/20 text-green-400'
                                      : task.status === 'in-progress'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-gray-500/20 text-gray-400'
                                  }`}
                                >
                                  {task.status}
                                </span>
                              </td>
                              <td className="p-3">
                                <select
                                        className="px-3 py-1 bg-gray-800/70 border border-gray-600 rounded-lg text-white text-sm"
                                  value={task.status}
                                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                            </tr>
                                ))
                              )}
                        </tbody>
                      </table>
                    </div>
                      )}
                      {taskViewMode === 'group' && (
                        <div className="overflow-x-auto rounded-xl">
                          <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                              <tr>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Task Name</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Assigned To</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Type</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Priority</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Status</th>
                                <th className="pb-3 text-gray-300 font-semibold text-base">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allEmployeeTasks.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-gray-400 py-6 text-base">No group tasks assigned.</td></tr>
                              ) : (
                                allEmployeeTasks.flatMap((groupTask) =>
                                  groupTask.group.map((task) => (
                                    <tr key={task.id} className="border-b border-gray-700/50 hover:bg-gray-800/40 transition-all">
                                      <td className="p-3 text-gray-200 font-normal">{task.taskName}</td>
                                      <td className="p-3 text-gray-200">{task.assignedTo}</td>
                                      <td className="p-3 text-gray-200">{task.taskType}</td>
                                      <td className="p-3 text-gray-200">{task.priority}</td>
                                      <td className="p-3">
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            task.status === 'completed'
                                              ? 'bg-green-500/20 text-green-400'
                                              : task.status === 'in-progress'
                                              ? 'bg-yellow-500/20 text-yellow-400'
                                              : 'bg-gray-500/20 text-gray-400'
                                          }`}
                                        >
                                          {task.status}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <select
                                          className="px-3 py-1 bg-gray-800/70 border border-gray-600 rounded-lg text-white text-sm"
                                          value={task.status}
                                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="in-progress">In Progress</option>
                                          <option value="completed">Completed</option>
                                        </select>
                                      </td>
                                    </tr>
                                  ))
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Modal */}
            <Analytics isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />

            {/* Reports Modal */}
            <Reports isOpen={showReports} onClose={() => setShowReports(false)} />

            {/* All Employee Task Assign Modal */}
            {showAllAssignModal && (
              <div className="fixed inset-0 z-50 overflow-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => handleOverlayClick(e, () => setShowAllAssignModal(false))}>
                <div className="bg-gray-600/20 backdrop-blur-md rounded-2xl w-full max-w-2xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
                    <h2 className="text-2xl font-semibold text-white">Assign Task to Employees</h2>
                    <button
                      onClick={() => setShowAllAssignModal(false)}
                      className="text-gray-400 hover:text-white transition-colors text-xl"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {/* Sticky Radio Group */}
                  <div className="sticky top-0 z-10 bg-gray-600/20 backdrop-blur-md pt-6 pb-3 px-6">
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="assignMode"
                          value="all"
                          checked={assignMode === 'all'}
                          onChange={() => setAssignMode('all')}
                          className="accent-blue-500 w-5 h-5"
                        />
                        <span className="text-white font-semibold">Assign to All Employees</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="assignMode"
                          value="selected"
                          checked={assignMode === 'selected'}
                          onChange={() => setAssignMode('selected')}
                          className="accent-yellow-500 w-5 h-5"
                        />
                        <span className="text-white font-semibold">Assign to Selected Employees</span>
                      </label>
                    </div>
                    <div className="border-b border-gray-700 mt-3" />
                  </div>
                  <div className="p-6 pt-2">
                    {/* Employee Checkbox List */}
                    {assignMode === 'selected' && (
                      <div className="mb-6 max-h-40 overflow-y-auto rounded-xl bg-gray-800/40 p-2 border border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {employees.map(emp => (
                          <label key={emp.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700/40 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.map(e => e.value).includes(emp.name)}
                              onChange={e => {
                                const newSelected = selectedEmployees.map(e => e.value).includes(emp.name)
                                  ? selectedEmployees.filter(e => e.value !== emp.name)
                                  : [...selectedEmployees, { value: emp.name, label: emp.name }];
                                setSelectedEmployees(newSelected);
                                if (newSelected.length === 1 && newSelected[0].value === 'all') {
                                  setTaskData({ ...taskData, assignedTo: 'all' });
                                } else if (newSelected.length === 1) {
                                  setTaskData({ ...taskData, assignedTo: newSelected[0].value });
                                } else {
                                  setTaskData({ ...taskData, assignedTo: 'selected' });
                                }
                              }}
                              className="accent-blue-500 w-4 h-4"
                            />
                            <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm bg-blue-700/60 text-white">
                              {emp.name?.slice(0,2).toUpperCase()}
                            </span>
                            <span className="text-white font-medium text-sm">{emp.name}</span>
                            <span className="text-gray-400 text-xs">{emp.email}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setIsAssigningAll(true);
                        try {
                          let targetEmployees = employees;
                          if (assignMode === 'selected') {
                            targetEmployees = employees.filter(emp => selectedEmployees.map(e => e.value).includes(emp.name));
                            if (targetEmployees.length === 0) {
                              toast.error('Please select at least one employee!');
                              setIsAssigningAll(false);
                              return;
                            }
                          }
                          const promises = targetEmployees.map(emp =>
                            axios.post('https://hackathon-bf312-default-rtdb.firebaseio.com/tasks.json', {
                              ...allAssignTaskData,
                              assignedTo: emp.name,
                              assignedBy: user.name,
                              timestamp: new Date().toISOString()
                            })
                          );
                          await Promise.all(promises);
                          toast.success(`Task assigned to ${assignMode === 'all' ? 'all employees' : targetEmployees.length + ' selected employees'} successfully!`);
                          setShowAllAssignModal(false);
                          setAllAssignTaskData({
                            taskName: '',
                            description: '',
                            taskType: 'BAU',
                            difficulty: 'easy',
                            priority: 'medium',
                            estimatedTime: '',
                            reference: '',
                            supportingLinks: '',
                            status: 'pending'
                          });
                          setAssignMode('all');
                          setSelectedEmployees([]);
                          fetchTasks();
                        } catch (error) {
                          toast.error('Failed to assign task');
                        } finally {
                          setIsAssigningAll(false);
                        }
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Task Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.taskName}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, taskName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Task Type</label>
                          <select
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.taskType}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, taskType: e.target.value })}
                          >
                            <option value="BAU">BAU</option>
                            <option value="Challenge">Challenge</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                          <select
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.priority}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, priority: e.target.value })}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                          <select
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.difficulty}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, difficulty: e.target.value })}
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                          <textarea
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.description}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Time</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.estimatedTime}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, estimatedTime: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Reference</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.reference}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, reference: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">Supporting Links</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white"
                            value={allAssignTaskData.supportingLinks}
                            onChange={e => setAllAssignTaskData({ ...allAssignTaskData, supportingLinks: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowAllAssignModal(false)}
                          className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                          disabled={isAssigningAll}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center 
    ${assignMode === 'all' ? 'bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600' : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'} text-white`}
                          disabled={isAssigningAll}
                        >
                          {isAssigningAll ? (
                            <>
                              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                              </svg>
                              Please wait, assigning task and sending email...
                            </>
                          ) : (
                            assignMode === 'all' ? 'Assign Task to All Employees' : 'Assign Task to Selected Employees'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {/* Custom Delete Confirm Modal */}
      {showDeleteConfirm && employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-700 rounded-2xl p-8 shadow-2xl border border-gray-600 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Delete Employee</h3>
            <p className="text-gray-200 mb-6">Are you sure you want to delete <span className="font-semibold text-red-400">{employeeToDelete.name}</span>?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => { setShowDeleteConfirm(false); setEmployeeToDelete(null); }}
                className="px-4 py-2 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteEmployee(employeeToDelete.id);
                  setShowDeleteConfirm(false);
                  setEmployeeToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployerView;