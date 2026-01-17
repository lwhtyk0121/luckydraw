
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
    } catch (e) { }
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
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
        <h2 className="text-2xl font-bold mb-10 flex items-center text-white font-display">
          <div className="p-2 bg-emerald-500/10 rounded-lg mr-4">
            <UserGroupIcon className="w-6 h-6 text-emerald-400" />
          </div>
          Seating Arrangement
        </h2>

        <div className="flex flex-col md:flex-row items-end gap-10">
          <div className="w-full md:w-64 space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Capacity Per Unit</label>
            <div className="relative group">
              <input
                type="number"
                min="2"
                max={participants.length}
                value={peoplePerGroup}
                onChange={(e) => setPeoplePerGroup(parseInt(e.target.value) || 2)}
                className="w-full p-5 bg-white/[0.03] border border-white/10 rounded-3xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all text-center font-bold text-3xl text-white tracking-widest"
              />
            </div>
          </div>

          <div className="flex-grow space-y-4">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex justify-between px-1">
              <span>Population: {participants.length}</span>
              <span>Predicted Nodes: {Math.ceil(participants.length / peoplePerGroup)}</span>
            </div>
            <button
              onClick={generateGroups}
              disabled={isGenerating}
              className={`w-full py-5 rounded-3xl font-black text-lg tracking-tight flex items-center justify-center transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] ${isGenerating
                  ? 'bg-white/5 text-slate-700'
                  : 'bg-white text-black hover:bg-slate-200'
                }`}
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="w-6 h-6 mr-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Squares2X2Icon className="w-6 h-6 mr-3" />
                  Automate Partition
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="animate-in fade-in duration-1000">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span>Partition Output</span>
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center px-4 py-2 bg-white/5 text-slate-400 rounded-full border border-white/5 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export Records
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="glass p-8 rounded-[2rem] border-white/5 hover:border-emerald-500/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <h4 className="font-bold text-white font-display text-lg flex items-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    {group.name}
                  </h4>
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-full">
                    {group.members.length} Units
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center px-4 py-2 bg-white/[0.04] rounded-xl border border-white/5 text-xs text-slate-300 font-bold hover:bg-white/10 transition-colors"
                    >
                      <CheckBadgeIcon className="w-3.5 h-3.5 mr-2 text-emerald-500/50" />
                      {member.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {groups.length === 0 && !isGenerating && (
        <div className="py-24 text-center glass rounded-[2.5rem] border border-dashed border-white/5">
          <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Squares2X2Icon className="w-6 h-6 text-slate-800" />
          </div>
          <p className="text-slate-700 font-bold uppercase text-[10px] tracking-[0.3em]">Configure population flow to begin</p>
        </div>
      )}
    </div>
  );
};

export default GroupTool;
