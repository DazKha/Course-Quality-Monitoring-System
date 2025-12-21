import React, { useState } from 'react';
import { LayoutGrid, Info, Shield } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SystemReliability from './components/SystemReliability';
import AboutUs from './components/AboutUs';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <LayoutGrid className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-white">MOOC Quality Monitor</h1>
                <p className="text-xs text-slate-400">Hệ thống phát hiện sớm khóa học cần cải thiện</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('reliability')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'reliability'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                  }`}
              >
                <Shield className="w-5 h-5" />
                <span>System Reliability</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'about'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                  }`}
              >
                <Info className="w-5 h-5" />
                <span>About Us</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'reliability' && <SystemReliability />}
        {activeTab === 'about' && <AboutUs />}
      </main>
    </div>
  );
}

export default App;


