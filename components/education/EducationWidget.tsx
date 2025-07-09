"use client";
import { useEducationContent } from "@/hooks/useEducationContent";

const categories = ["Poupança", "CDB", "Tesouro", "Ações", "Criptos"];

export function EducationWidget() {
  const { contents, setCategory, category } = useEducationContent();

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Educação Financeira</h2>
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-3 py-1 rounded-full text-sm border ${category === cat ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <button
          className={`px-3 py-1 rounded-full text-sm border ${!category ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setCategory(null)}
        >
          Todos
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contents.map(content => (
          <a
            key={content.id}
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-emerald-50 rounded-lg p-4 shadow hover:bg-emerald-100 transition"
          >
            <div className="font-bold mb-1">{content.title}</div>
            <div className="text-xs text-gray-600 mb-2">{content.category} • {content.type}</div>
            <div className="text-sm text-gray-700">{content.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
} 