
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
    <div className="space-y-6">
      {/* Config & Draw Area */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4">
           <label className="flex items-center cursor-pointer space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <input 
              type="checkbox" 
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-xs font-medium text-slate-600">允許重複抽中</span>
          </label>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center mb-2">
            <GiftIcon className="w-8 h-8 mr-2 text-purple-500" />
            獎品大抽籤
          </h2>
          <p className="text-slate-500">準備好揭曉幸運兒了嗎？</p>
        </div>

        {/* Display Area */}
        <div className="relative h-48 flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-slate-50 rounded-2xl flex items-center justify-center border-4 border-slate-100 overflow-hidden">
             {/* Rolling Animation */}
             {isRolling ? (
               <div className="text-5xl font-black text-purple-600 animate-pulse transition-all">
                 {participants[currentIndex]?.name}
               </div>
             ) : lastWinner ? (
               <div className="text-center">
                 <div className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-2">幸運得主</div>
                 <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600 animate-float">
                    {lastWinner.name}
                 </div>
                 <div className="mt-4 text-xs text-slate-500">恭喜中獎！</div>
               </div>
             ) : (
               <div className="text-slate-300 text-xl font-medium">點擊下方按鈕開始</div>
             )}
          </div>
        </div>

        <button
          onClick={startDraw}
          disabled={isRolling || availablePool.length === 0}
          className={`px-12 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto ${
            isRolling || availablePool.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-200 shadow-purple-500/20'
          }`}
        >
          {isRolling ? (
            <>
              <ArrowPathIcon className="w-6 h-6 mr-2 animate-spin" />
              正在抽取...
            </>
          ) : (
            '開始抽籤'
          )}
        </button>

        <div className="mt-4 text-xs text-slate-400 italic">
          剩餘可抽中人數: {availablePool.length} 位
        </div>
      </div>

      {/* Winners List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ListBulletIcon className="w-5 h-5 mr-2 text-purple-500" />
          抽籤歷史記錄
        </h3>
        {winners.length === 0 ? (
          <div className="py-8 text-center text-slate-400 italic">
            目前尚無中獎紀錄
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {winners.map((winner, idx) => (
              <div 
                key={`${winner.id}-${idx}`}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    {winners.length - idx}
                  </span>
                  <span className="font-semibold text-slate-700">{winner.name}</span>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <TrophyIcon className="w-3 h-3 mr-1" />
                  Winner
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyDraw;
