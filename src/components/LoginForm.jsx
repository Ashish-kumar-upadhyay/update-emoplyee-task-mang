import React, { useState } from 'react';
import { UserCircle, Mail, User, Building, Shield } from 'lucide-react';
import ParticlesComponent from './particle';

export function LoginForm({ onLogin, onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    password: '', // Add password to formData
  });
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState('employee');

  const validateEmployee = async (name) => {
    try {
      const response = await fetch('https://hackathon-bf312-default-rtdb.firebaseio.com/employees.json');
      const data = await response.json();
      const employeeExists = Object.values(data).some(
        employee => employee.name.toLowerCase() === name.toLowerCase()
      );
      return employeeExists;
    } catch (error) {
      console.error('Error validating employee:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (activeRole === 'employee') {
      const isValidEmployee = await validateEmployee(formData.name);
      if (!isValidEmployee) {
        setError('Employee does not exist');
        return;
      }
    }
    if (activeRole === 'employer') {
      // Hardcoded admin password (change as needed)
      const ADMIN_PASSWORD = 'admin123';
      if (formData.password !== ADMIN_PASSWORD) {
        setError('Incorrect admin password');
        return;
      }
    }
    onLogin({ ...formData, role: activeRole });
    if (onNavigate) {
      onNavigate(`/dashboard/${activeRole}`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle background */}
      <ParticlesComponent id="login-particles" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-5xl px-4 py-16">
        {/* Employee Card */}
        <div
          className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-500 cursor-pointer ${activeRole === 'employee' ? 'scale-105 rotate-[-4deg] shadow-blue-400/30' : 'scale-95 opacity-70 hover:scale-100 hover:opacity-100'} `}
          onClick={() => setActiveRole('employee')}
        >
          <div className="flex flex-col items-center mb-6">
            <UserCircle className="w-14 h-14 text-blue-400 mb-2" />
            <h2 className="text-2xl font-bold text-white mb-1">Employee Login</h2>
            <p className="text-gray-200 text-sm">For team members</p>
          </div>
          {activeRole === 'employee' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {error && (
                <div className="mb-2 p-2 rounded-lg bg-red-500/20 border border-red-500 text-red-100 text-center text-sm">{error}</div>
              )}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                <input
                  type="text"
                  required
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-black/40 text-white placeholder:text-blue-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-black/40 text-white placeholder:text-blue-200"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:scale-[1.03] active:scale-[0.98]"
              >
                Sign In as Employee
              </button>
            </form>
          )}
        </div>
        {/* Admin Card */}
        <div
          className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-500 cursor-pointer ${activeRole === 'employer' ? 'scale-105 rotate-[4deg] shadow-purple-400/30' : 'scale-95 opacity-70 hover:scale-100 hover:opacity-100'} `}
          onClick={() => setActiveRole('employer')}
        >
          <div className="flex flex-col items-center mb-6">
            <Shield className="w-14 h-14 text-purple-400 mb-2" />
            <h2 className="text-2xl font-bold text-white mb-1">Admin Login</h2>
            <p className="text-gray-200 text-sm">For organization admins</p>
          </div>
          {activeRole === 'employer' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {error && (
                <div className="mb-2 p-2 rounded-lg bg-red-500/20 border border-red-500 text-red-100 text-center text-sm">{error}</div>
              )}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" />
                <input
                  type="text"
                  required
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-black/40 text-white placeholder:text-purple-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-black/40 text-white placeholder:text-purple-200"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              {/* Password Field for Admin */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0a2 2 0 100-4 2 2 0 000 4zm6-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m12 0V9a6 6 0 10-12 0v6m12 0H6" /></svg>
                <input
                  type="password"
                  required
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-black/40 text-white placeholder:text-purple-200"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-md hover:scale-[1.03] active:scale-[0.98]"
              >
                Sign In as Admin
              </button>
            </form>
          )}
        </div>
      </div>
      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default LoginForm;