"use client";

import { Mood } from "@/src/types";

const moods: { value: Mood; emoji: string; label: string; color: string }[] = [
  {
    value: "tired",
    emoji: "😴",
    label: "Tired",
    color:
      "hover:bg-slate-100 data-[selected=true]:bg-slate-100 data-[selected=true]:border-slate-400",
  },
  {
    value: "okay",
    emoji: "😐",
    label: "Okay",
    color:
      "hover:bg-yellow-50 data-[selected=true]:bg-yellow-50 data-[selected=true]:border-yellow-400",
  },
  {
    value: "good",
    emoji: "🙂",
    label: "Good",
    color:
      "hover:bg-blue-50 data-[selected=true]:bg-blue-50 data-[selected=true]:border-blue-400",
  },
  {
    value: "happy",
    emoji: "😊",
    label: "Happy",
    color:
      "hover:bg-green-50 data-[selected=true]:bg-green-50 data-[selected=true]:border-green-400",
  },
  {
    value: "excited",
    emoji: "🤩",
    label: "Excited",
    color:
      "hover:bg-purple-50 data-[selected=true]:bg-purple-50 data-[selected=true]:border-purple-400",
  },
];

interface Props {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

export default function MoodSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          data-selected={selected === mood.value}
          onClick={() => onSelect(mood.value)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl border
                      border-transparent transition-all duration-150
                      ${mood.color}`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs text-slate-500 font-medium">
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}
