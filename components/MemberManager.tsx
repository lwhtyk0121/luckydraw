
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { 
  ArrowUpTrayIcon, 
  TrashIcon, 
  DocumentPlusIcon,
  XMarkIcon,
  UsersIcon,
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <DocumentPlusIcon className="w-5 h-5 mr-2 text-indigo-600" />
            新增名單
          </h2>
          <button
            onClick={handleAddMockData}
            className="text-xs flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <BeakerIcon className="w-4 h-4 mr-1" />
            產生範例名單
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">貼上姓名 (每行一位)</label>
            <textarea
              className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
              placeholder="例如：&#10;王小明&#10;李大華&#10;張美麗"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">上傳 CSV</label>
              <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                <ArrowUpTrayIcon className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-500" />
                <span className="text-xs text-slate-500 text-center">支援 CSV 格式<br/>(系統將讀取第一欄作為姓名)</span>
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
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
            >
              確認新增
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-indigo-600" />
              當前名單 ({participants.length})
            </h2>
            {duplicateNames.size > 0 && (
              <span className="text-xs text-red-500 mt-1 flex items-center">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                偵測到 {duplicateNames.size} 個重複姓名
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {duplicateNames.size > 0 && (
              <button
                onClick={removeDuplicates}
                className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-100"
              >
                移除重複項
              </button>
            )}
            {participants.length > 0 && (
              <button
                onClick={clearAll}
                className="text-slate-400 text-sm hover:text-red-500 flex items-center transition-colors"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                全部清空
              </button>
            )}
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="py-12 text-center text-slate-400 italic">
            目前尚未有名單資料
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {participants.map((p) => {
              const isDuplicate = duplicateNames.has(p.name);
              return (
                <div 
                  key={p.id} 
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                    isDuplicate 
                      ? 'bg-red-50 border-red-200 hover:border-red-400' 
                      : 'bg-slate-50 border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center min-w-0">
                    <span className={`text-sm truncate font-medium ${isDuplicate ? 'text-red-700' : 'text-slate-700'}`}>
                      {p.name}
                    </span>
                    {isDuplicate && (
                      <span className="ml-1 text-[10px] bg-red-200 text-red-700 px-1 rounded">重複</span>
                    )}
                  </div>
                  <button 
                    onClick={() => removeItem(p.id)}
                    className={`p-1 transition-colors opacity-0 group-hover:opacity-100 ${
                      isDuplicate ? 'text-red-400 hover:text-red-600' : 'text-slate-400 hover:text-red-500'
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
