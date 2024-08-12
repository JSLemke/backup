'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FamilyDashboard from '../components/FamilyDashboard';
import Profile from '../components/Profile';
import ChatPage from '../components/ChatPage';
import CalendarPage from '../components/CalendarPage';
import TasksPage from '../components/TasksPage';
import ShoppingListPage from '../components/ShoppingListPage';
import GPSPage from '../components/GPSPage';

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState('home');

    const renderContent = () => {
        switch (currentPage) {
            case 'profile':
                return <Profile />;
            case 'chat':
                return <ChatPage />;
            case 'calendar':
                return <CalendarPage />;
            case 'tasks':
                return <TasksPage />;
            case 'shoppingList':
                return <ShoppingListPage />;
            case 'gps':
                return <GPSPage />;
            case 'home':
            default:
                return <FamilyDashboard />;
        }
    };

    return (
        <div className="flex">
            <Sidebar setCurrentPage={setCurrentPage} />
            <div className="flex-1 p-8">
                {renderContent()}
            </div>
        </div>
    );
}
