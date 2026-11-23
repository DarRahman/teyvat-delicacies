import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#120F1D] text-slate-100 flex items-center justify-center p-4">
      {/* Centered Mobile Viewport Frame Canvas */}
      <div className="w-full max-w-[420px] h-[840px] bg-[#1D1A2A] rounded-[36px] border border-[#5D5187]/50 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center relative">
        <div className="w-16 h-16 rounded-full border border-[#FFE7A5] bg-[#120F1D] flex items-center justify-center mb-4">
          <img
            src="/assets/icons/mora.png"
            alt="Teyvat"
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-xl font-bold text-[#FFE7A5] font-genshin tracking-wide">
          TEYVAT DELICACIES
        </h1>
        <p className="text-xs text-slate-400 mt-2 max-w-[280px]">
          Canvas is clean and ready. Awaiting UI/UX generation from Google AI Studio / Stitch.
        </p>
      </div>
    </div>
  );
}
