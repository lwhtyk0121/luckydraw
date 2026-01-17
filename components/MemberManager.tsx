
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import {
  ArrowUpTrayIcon,
  TrashIcon,
  DocumentPlusIcon,
  XMarkIcon,
  UsersIcon,
  Squares2X2Icon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface MemberManagerProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
}

const MemberManager: React.FC<MemberManagerProps> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  // 偵測重複姓名
  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return new Set(Object.keys(counts).filter(name => counts[name] > 1));
  }, [participants]);

  const handleAddFromText = () => {
    const names = inputText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    const newList = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onUpdate([...participants, ...newList]);
    setInputText('');
  };

  const handleAddMockData = () => {
    const mockNames = [
      '陳大文', '李小華', '張美麗', '林書豪', '王力宏',
      '周杰倫', '林俊傑', '蔡依林', '蕭敬騰', '楊丞琳',
      '羅志祥', '徐若瑄', '金城武', '梁朝偉', '劉德華',
      '郭富城', '黎明', '張學友', '謝霆鋒', '陳奕迅'
    ];
    const newList = mockNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...newList]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',')[0].trim()).filter(Boolean);
      if (rows[0] && (rows[0].toLowerCase().includes('name') || rows[0].includes('姓名'))) {
        rows.shift();
      }

      const newList = rows.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      onUpdate([...participants, ...newList]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const removeItem = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      onUpdate([]);
    }
  };

  return (
    <div className="space-y-10 w-full">
      <div className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center text-white font-display">
            <div className="p-2 bg-blue-500/10 rounded-lg mr-4">
              <DocumentPlusIcon className="w-6 h-6 text-blue-400" />
            </div>
            Manage Registry
          </h2>
          <button
            onClick={handleAddMockData}
            className="text-[10px] font-bold tracking-widest uppercase flex items-center px-4 py-2 bg-white/5 text-slate-400 rounded-full hover:bg-white/10 transition-all border border-white/5 active:scale-95"
          >
            <BeakerIcon className="w-4 h-4 mr-2" />
            Mock Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Batch Import (One per line)</label>
            <textarea
              className="w-full h-40 p-5 bg-white/[0.03] border border-white/10 rounded-3xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all resize-none text-sm text-slate-300 placeholder:text-slate-700 font-medium"
              placeholder="Enter names here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">CSV Upload</label>
              <div className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center hover:bg-white/5 hover:border-blue-500/30 transition-all duration-300">
                <ArrowUpTrayIcon className="w-10 h-10 text-slate-600 mb-4 group-hover:text-blue-400 transition-colors" />
                <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-600 group-hover:text-slate-400">Drop files here or click</span>
                <input
                  type="file"
                  accept=".csv"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <button
              onClick={handleAddFromText}
              disabled={!inputText.trim()}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-xl"
            >
              Add to List
            </button>
          </div>
        </div>
      </div>

      <div className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold flex items-center text-white font-display">
              <div className="p-2 bg-indigo-500/10 rounded-lg mr-4">
                <UsersIcon className="w-6 h-6 text-indigo-400" />
              </div>
              On Registry
              <span className="ml-4 text-sm font-mono bg-white/5 px-3 py-1 rounded-full text-slate-500">{participants.length}</span>
            </h2>
            {duplicateNames.size > 0 && (
              <span className="text-xs text-rose-400 mt-2 flex items-center font-medium">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                Detected {duplicateNames.size} duplicate entries
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {duplicateNames.size > 0 && (
              <button
                onClick={removeDuplicates}
                className="text-[10px] font-bold tracking-widest uppercase bg-rose-500/10 text-rose-400 px-4 py-2 rounded-full hover:bg-rose-500/20 transition-all border border-rose-500/20"
              >
                Cleanup
              </button>
            )}
            {participants.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[10px] font-bold tracking-widest uppercase text-slate-600 hover:text-rose-500 flex items-center transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-rose-500/20"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Wipe All
              </button>
            )}
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
              <UsersIcon className="w-8 h-8 text-slate-800" />
            </div>
            <p className="text-slate-600 font-medium tracking-tight">Registry is currently empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {participants.map((p) => {
              const isDuplicate = duplicateNames.has(p.name);
              return (
                <div
                  key={p.id}
                  className={`group flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-300 ${isDuplicate
                      ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40'
                      : 'bg-white/[0.03] border-white/5 hover:border-blue-500/30'
                    }`}
                >
                  <div className="flex items-center min-w-0">
                    <span className={`text-sm tracking-tight font-semibold truncate ${isDuplicate ? 'text-rose-400' : 'text-slate-200'}`}>
                      {p.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(p.id)}
                    className={`p-1 transition-all opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 ${isDuplicate ? 'text-rose-400 hover:text-rose-300' : 'text-slate-600 hover:text-rose-400'
                      }`}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManager;
