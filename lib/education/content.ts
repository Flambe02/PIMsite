export interface EducationContent {
  id: string;
  type: "article" | "video" | "quiz";
  category: "Poupança" | "CDB" | "Tesouro" | "Ações" | "Criptos";
  title: string;
  description: string;
  url: string;
}

export const educationContents: EducationContent[] = [
  {
    id: "1",
    type: "article",
    category: "Poupança",
    title: "Como funciona a poupança?",
    description: "Entenda os rendimentos e riscos da poupança.",
    url: "https://exemplo.com/artigo-poupanca",
  },
  {
    id: "2",
    type: "video",
    category: "CDB",
    title: "CDB: o que é e como investir",
    description: "Vídeo explicativo sobre CDBs.",
    url: "https://youtube.com/cdb-explicacao",
  },
  // ... autres contenus
]; 