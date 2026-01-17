
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import {
  GiftIcon,
  ArrowPathIcon,
  TrophyIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastWinner, setLastWinner] = useState<Participant | null>(null);

  const timerRef = useRef<number | null>(null);

  // Available pool for non-duplicate draws
  const availablePool = allowDuplicates
    ? participants
    : participants.filter(p => !winners.find(w => w.id === p.id));

  const startDraw = () => {
    if (availablePool.length === 0) {
      alert('所有成員都已中獎！');
      return;
    }

    setIsRolling(true);
    setLastWinner(null);
    let speed = 50;
    let iterations = 0;
    const maxIterations = 30 + Math.floor(Math.random() * 20);

    const roll = () => {
      setCurrentIndex(Math.floor(Math.random() * participants.length));
      iterations++;

      if (iterations < maxIterations) {
        speed += 10;
        timerRef.current = window.setTimeout(roll, speed);
      } else {
        finishDraw();
      }
    };

    roll();
  };

  const finishDraw = () => {
    setIsRolling(false);
    const pool = allowDuplicates
      ? participants
      : participants.filter(p => !winners.find(w => w.id === p.id));

    if (pool.length > 0) {
      const winner = pool[Math.floor(Math.random() * pool.length)];
      setLastWinner(winner);
      setWinners(prev => [winner, ...prev]);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Config & Draw Area */}
      <div className="glass p-12 rounded-[2.5rem] border-white/5 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-8 right-8 z-10">
          <label className="flex items-center cursor-pointer space-x-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-all">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="w-4 h-4 bg-transparent border-white/20 rounded text-blue-500 focus:ring-blue-500/50"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Allow Duplicates</span>
          </label>
        </div>

        <div className="mb-12">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrophyIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-4xl font-black text-white font-display tracking-tight mb-3">
            Grand Lottery
          </h2>
          <p className="text-slate-500 font-medium tracking-tight">Who will be the next lucky standout?</p>
        </div>

        {/* Display Area */}
        <div className="relative h-64 flex items-center justify-center mb-12">
          <div className="absolute inset-0 bg-white/[0.02] rounded-3xl flex items-center justify-center border border-white/5 overflow-hidden shadow-inner">
            {/* Rolling Animation */}
            {isRolling ? (
              <div className="text-6xl font-black text-indigo-500 animate-pulse transition-all font-display tracking-tighter">
                {participants[currentIndex]?.name}
              </div>
            ) : lastWinner ? (
              <div className="text-center animate-in zoom-in-95 duration-500">
                <div className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 font-black mb-4 glow-text">Selected Winner</div>
                <div className="text-7xl font-black text-white font-display tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  {lastWinner.name}
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="px-4 py-1.5 bg-indigo-500/10 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                    Congratulations
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-700 text-xs font-bold uppercase tracking-[0.3em]">Ready for initialization</div>
            )}
          </div>
        </div>

        <button
          onClick={startDraw}
          disabled={isRolling || availablePool.length === 0}
          className={`px-16 py-5 rounded-2xl text-lg font-black tracking-tight transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mx-auto min-w-[240px] shadow-2xl ${isRolling || availablePool.length === 0
              ? 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
              : 'bg-white text-black hover:bg-slate-200'
            }`}
        >
          {isRolling ? (
            <>
              <ArrowPathIcon className="w-6 h-6 mr-3 animate-spin" />
              Rolling...
            </>
          ) : (
            availablePool.length === 0 ? 'Pool Depleted' : 'Initiate Draw'
          )}
        </button>

        <div className="mt-8 flex justify-center items-center space-x-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-indigo-500/50 rounded-full animate-pulse"></div>
          <span>Remaining Candidates: {availablePool.length}</span>
        </div>
      </div>

      {/* Winners List */}
      <div className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
        <h3 className="text-xl font-bold mb-8 flex items-center text-white font-display">
          <div className="p-2 bg-indigo-500/10 rounded-lg mr-4">
            <ListBulletIcon className="w-6 h-6 text-indigo-400" />
          </div>
          Hall of Fame
        </h3>
        {winners.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
              <GiftIcon className="w-6 h-6 text-slate-800" />
            </div>
            <p className="text-slate-600 font-medium tracking-tight uppercase text-xs tracking-[0.2em]">No history accumulated</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-4">
            {winners.map((winner, idx) => (
              <div
                key={`${winner.id}-${idx}`}
                className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center text-[10px] font-black mr-4 border border-indigo-500/10">
                    #{winners.length - idx}
                  </span>
                  <span className="font-bold text-slate-200 tracking-tight">{winner.name}</span>
                </div>
                <TrophyIcon className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyDraw;
