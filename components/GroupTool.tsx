
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { 
  Squares2X2Icon, 
  UserGroupIcon, 
  ArrowPathIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { GoogleGenAI, Type } from "@google/genai";

interface GroupToolProps {
  participants: Participant[];
}

const GroupTool: React.FC<GroupToolProps> = ({ participants }) => {
  const [peoplePerGroup, setPeoplePerGroup] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateGroups = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    await new Promise(r => setTimeout(r, 800));

    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    const groupCount = Math.ceil(participants.length / peoplePerGroup);

    for (let i = 0; i < groupCount; i++) {
      const members = shuffled.slice(i * peoplePerGroup, (i + 1) * peoplePerGroup);
      if (members.length > 0) {
        newGroups.push({
          id: `group-${i}`,
          name: `第 ${i + 1} 組`,
          members
        });
      }
    }

    setGroups(newGroups);
    setIsGenerating(false);

    try {
       await fetchGroupNames(newGroups);
    } catch (e) {
       console.error("Failed to get creative names", e);
    }
  };

  const fetchGroupNames = async (currentGroups: Group[]) => {
    if (!process.env.API_KEY) return;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請幫這 ${currentGroups.length} 個分組取一些創意、充滿活力的中文組名。請根據以下清單回傳：${currentGroups.map(g => g.name).join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    try {
      const names = JSON.parse(response.text);
      if (Array.isArray(names) && names.length >= currentGroups.length) {
        setGroups(prev => prev.map((g, idx) => ({ ...g, name: names[idx] })));
      }
    } catch (e) {}
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // CSV Header
    let csvContent = "\uFEFF組別名稱,成員姓名\n";

    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <UserGroupIcon className="w-5 h-5 mr-2 text-emerald-600" />
          分組設定
        </h2>
        
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-2">每組幾人？</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="2"
                max={participants.length}
                value={peoplePerGroup}
                onChange={(e) => setPeoplePerGroup(parseInt(e.target.value) || 2)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center font-bold text-lg"
              />
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="text-xs text-slate-400 mb-2">
              總人數：{participants.length} 人，預計分成 {Math.ceil(participants.length / peoplePerGroup)} 組
            </div>
            <button
              onClick={generateGroups}
              disabled={isGenerating}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                isGenerating 
                  ? 'bg-slate-100 text-slate-400' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  正在分組中...
                </>
              ) : (
                <>
                  <Squares2X2Icon className="w-5 h-5 mr-2" />
                  開始自動分組
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-700">分組結果</h3>
            <button
              onClick={downloadCSV}
              className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors text-sm font-medium"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              下載 CSV 紀錄
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div 
                key={group.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-200 transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                  <h4 className="font-bold text-emerald-700 flex items-center">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                     {group.name}
                  </h4>
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                    {group.members.length} 人
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.members.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 font-medium"
                    >
                      <CheckBadgeIcon className="w-3 h-3 mr-1 text-emerald-400" />
                      {member.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {groups.length === 0 && !isGenerating && (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-300 italic">
          設定組員人數後點擊按鈕生成分組結果
        </div>
      )}
    </div>
  );
};

export default GroupTool;
