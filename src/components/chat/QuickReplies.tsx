"use client";

import { QUICK_REPLIES } from "@/lib/chatConstants";

interface Props {
  onSelect: (text: string) => void;
}

export default function QuickReplies({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {QUICK_REPLIES.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="px-3 py-1.5 text-xs rounded-full border border-[rgba(52,152,219,0.3)]
                     text-white/70 hover:text-white hover:border-[#3498db] hover:bg-white/5
                     transition-all duration-200 min-h-[44px] sm:min-h-0"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
