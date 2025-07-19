import React from "react";

type Props = {
  selected: string;
  onSelect: (key: string) => void;
  sections: { key: string; label: string; icon?: React.ReactNode }[];
};

export default function AccountSidebar({ selected, onSelect, sections }: Props) {
  return (
    <nav className="w-64 bg-white border-r min-h-screen" aria-label="Navigation du compte">
      <ul className="py-8 space-y-2">
        {sections.map((section) => (
          <li key={section.key}>
            <button
              className={`w-full flex items-center gap-3 text-left px-6 py-3 rounded-lg transition ${
                selected === section.key
                  ? "bg-emerald-100 text-emerald-700 font-bold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onSelect(section.key)}
              aria-current={selected === section.key ? "page" : undefined}
            >
              {section.icon}
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
} 