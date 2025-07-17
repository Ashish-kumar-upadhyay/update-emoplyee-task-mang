import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Navbar({ user, showNotifications, setShowNotifications }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add any logout logic here (clear tokens, etc)
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Menu className="h-6 w-6 text-gray-600" />
                        <span className="ml-3 text-xl font-semibold text-gray-800">Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Bell className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                        <div className="flex items-center">
                            <img
                                className="h-8 w-8 rounded-full"
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                alt={user.name}
                            />
                            <span className="ml-2 text-gray-700">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="ml-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                            >
                                <LogOut className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
