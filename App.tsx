
import React, { useState, useEffect } from 'react';
import { Tab, Participant } from './types';
import MemberManager from './components/MemberManager';
import LuckyDraw from './components/LuckyDraw';
import GroupTool from './components/GroupTool';
import { 
  UsersIcon, 
  TrophyIcon, 
  Squares2X2Icon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LIST);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Load initial data if needed or provide feedback
  const handleUpdateList = (newList: Participant[]) => {
    setParticipants(newList);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
              HR
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              萬能工具箱
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-sm text-slate-500">
            <span>名單管理</span>
            <ChevronRightIcon className="w-4 h-4" />
            <span>抽籤</span>
            <ChevronRightIcon className="w-4 h-4" />
            <span>分組</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab(Tab.LIST)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === Tab.LIST 
                    ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UsersIcon className="w-5 h-5" />
                <span className="font-medium">成員名單 ({participants.length})</span>
              </button>
              
              <button
                onClick={() => setActiveTab(Tab.DRAW)}
                disabled={participants.length === 0}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeTab === Tab.DRAW 
                    ? 'bg-purple-600 text-white shadow-md transform scale-[1.02]' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TrophyIcon className="w-5 h-5" />
                <span className="font-medium">獎品抽籤</span>
              </button>
              
              <button
                onClick={() => setActiveTab(Tab.GROUP)}
                disabled={participants.length === 0}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeTab === Tab.GROUP 
                    ? 'bg-emerald-600 text-white shadow-md transform scale-[1.02]' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
                <span className="font-medium">自動分組</span>
              </button>
            </nav>

            {participants.length === 0 && (
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-sm">
                請先新增成員名單以開始使用抽籤與分組功能。
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {activeTab === Tab.LIST && (
              <MemberManager 
                participants={participants} 
                onUpdate={handleUpdateList} 
              />
            )}
            {activeTab === Tab.DRAW && (
              <LuckyDraw 
                participants={participants} 
              />
            )}
            {activeTab === Tab.GROUP && (
              <GroupTool 
                participants={participants} 
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} HR Productivity Toolkit. Made with ❤️ for HR Pros.
        </div>
      </footer>
    </div>
  );
};

export default App;
