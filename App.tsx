
import React, { useState, useEffect } from 'react';
import { Tab, Participant } from './types';
import MemberManager from './components/MemberManager';
import LuckyDraw from './components/LuckyDraw';
import GroupTool from './components/GroupTool';
import {
  UsersIcon,
  TrophyIcon,
  Squares2X2Icon,
  ChevronRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LIST);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Load initial data if needed or provide feedback
  const handleUpdateList = (newList: Participant[]) => {
    setParticipants(newList);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-100 selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              AG
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight font-display text-white">
                Antigravity Tools
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">HR Productivity Suite</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-500">
            <span className="hover:text-white transition-colors cursor-pointer">MANAGER</span>
            <ChevronRightIcon className="w-3 h-3 text-slate-700" />
            <span className="hover:text-white transition-colors cursor-pointer text-slate-400">DRAW</span>
            <ChevronRightIcon className="w-3 h-3 text-slate-700" />
            <span className="hover:text-white transition-colors cursor-pointer">GROUPS</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
        {participants.length === 0 && activeTab === Tab.LIST ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-semibold mb-6">Welcome to</p>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tighter text-center">
              Antigravity <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">System</span>
            </h2>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 font-bold mb-12">
              PREVIEW v1.0
            </div>

            <div className="max-w-2xl w-full glass rounded-[2rem] p-10 border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-blue-400 mb-6 glow-text text-center">Getting Started</h3>
              <p className="text-slate-400 text-center leading-relaxed text-lg mb-8">
                The agent can click, scroll, type, and navigate web pages automatically.
                While working, it displays an overlay showing its progress and provides
                controls to stop execution if you need to intervene.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setActiveTab(Tab.LIST)}
                  className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all hover:scale-105"
                >
                  Configure Manager
                </button>
              </div>
            </div>

            <div className="mt-20 flex flex-col items-center">
              <MemberManager
                participants={participants}
                onUpdate={handleUpdateList}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Sidebar Tabs */}
            <div className="lg:col-span-3">
              <nav className="space-y-3 sticky top-30">
                <button
                  onClick={() => setActiveTab(Tab.LIST)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border ${activeTab === Tab.LIST
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <UsersIcon className="w-5 h-5" />
                    <span className="font-semibold tracking-tight text-sm">Members</span>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md font-bold">{participants.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab(Tab.DRAW)}
                  disabled={participants.length === 0}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all border ${participants.length === 0 ? 'opacity-30 cursor-not-allowed' : ''
                    } ${activeTab === Tab.DRAW
                      ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                >
                  <TrophyIcon className="w-5 h-5" />
                  <span className="font-semibold tracking-tight text-sm">Lucky Draw</span>
                </button>

                <button
                  onClick={() => setActiveTab(Tab.GROUP)}
                  disabled={participants.length === 0}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all border ${participants.length === 0 ? 'opacity-30 cursor-not-allowed' : ''
                    } ${activeTab === Tab.GROUP
                      ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                  <span className="font-semibold tracking-tight text-sm">Group Tool</span>
                </button>
              </nav>

              {participants.length === 0 && (
                <div className="mt-8 p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20 text-blue-400/80 text-xs leading-relaxed">
                  <p className="font-bold mb-2 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                    Empty List
                  </p>
                  Please add some members in the manager tab to unlock the lucky draw and grouping features.
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-9 animate-in fade-in slide-in-from-right-4 duration-500">
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
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] tracking-widest font-bold">
          <div className="mb-4 md:mb-0 uppercase italic">Powering modern HR workflows</div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">PRIVACY</span>
            <span className="hover:text-white transition-colors cursor-pointer">TERMS</span>
            <span className="text-white/20">|</span>
            <span>&copy; {new Date().getFullYear()} ANTIGRAVITY CORP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
