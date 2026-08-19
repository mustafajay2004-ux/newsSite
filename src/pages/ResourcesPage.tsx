import { useState } from "react";
import { Search, Filter, Download, Eye, Star, Upload, FileText, BarChart2, BookOpen, Clock, SlidersHorizontal } from "lucide-react";

const categories = ["Tout", "Cours", "TD/TP", "Annales", "Projets", "Tutoriels"];

const resources = [
  {
    id: 1, title: "Cours Complet – Cryptographie Appliquée", subject: "Cybersécurité",
    author: "Pr. Michel Dubois", date: "14 Août 2026", format: "PDF",
    downloads: 342, views: 1240, rating: 4.9, size: "4.2 MB",
    category: "Cours",
    description: "Cours magistral complet couvrant les algorithmes de chiffrement symétrique et asymétrique, les protocoles TLS/SSL et les fondements mathématiques.",
  },
  {
    id: 2, title: "TP Docker & Kubernetes – Déploiement Microservices", subject: "DevOps",
    author: "Lucas Bernard", date: "12 Août 2026", format: "ZIP",
    downloads: 187, views: 640, rating: 4.7, size: "18.5 MB",
    category: "TD/TP",
    description: "Ensemble complet de TP avec configurations Docker Compose, manifests Kubernetes et scripts d'automatisation CI/CD.",
  },
  {
    id: 3, title: "Slides – Introduction aux Transformers & Attention", subject: "IA & ML",
    author: "Emma Leroy", date: "10 Août 2026", format: "PPTX",
    downloads: 521, views: 2180, rating: 4.8, size: "12.1 MB",
    category: "Cours",
    description: "Présentation de 80 slides expliquant les mécanismes d'attention, l'architecture Transformer et ses applications (BERT, GPT).",
  },
  {
    id: 4, title: "Annales Algorithmique 2021-2025 + Corrections", subject: "Informatique",
    author: "Sarah Dupont", date: "8 Août 2026", format: "PDF",
    downloads: 896, views: 3560, rating: 4.9, size: "6.7 MB",
    category: "Annales",
    description: "5 années d'annales d'algorithmique avec corrections détaillées, classées par thème : tri, graphes, programmation dynamique.",
  },
  {
    id: 5, title: "Rapport de Projet – Application de Vote Sécurisé", subject: "Cybersécurité",
    author: "Théo Mercier", date: "5 Août 2026", format: "PDF",
    downloads: 134, views: 490, rating: 4.5, size: "3.8 MB",
    category: "Projets",
    description: "Rapport détaillé d'un projet de fin d'année sur la conception d'un système de vote électronique sécurisé avec ZKP.",
  },
  {
    id: 6, title: "Guide Pratique – Pandas & Visualisation avec Plotly", subject: "Data Science",
    author: "Emma Leroy", date: "3 Août 2026", format: "IPYNB",
    downloads: 278, views: 920, rating: 4.6, size: "8.9 MB",
    category: "Tutoriels",
    description: "Notebook Jupyter interactif avec 30 exercices progressifs couvrant la manipulation de données et la visualisation avancée.",
  },
];

const formatBadge: Record<string, string> = {
  PDF: "bg-red-100 text-red-600",
  ZIP: "bg-green-100 text-green-700",
  PPTX: "bg-blue-100 text-blue-600",
  IPYNB: "bg-orange-100 text-orange-600",
  DOCX: "bg-sky-100 text-sky-600",
};

function StatBadge({ icon: Icon, value, label }: { icon: React.ElementType; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg p-2 flex items-center justify-center shrink-0">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-900">{value}</p>
        <p className="text-[11px] text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");

  const filtered = resources.filter((r) => {
    const matchCat = activeCategory === "Tout" || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-screen-lg mx-auto px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ressources</h1>
            <p className="text-sm text-slate-500 mt-1">Cours, TDs, annales et projets partagés par la communauté</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
            <Upload size={15} />
            Déposer une ressource
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher des ressources, cours, annales..."
              className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 h-11 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 shadow-sm transition-all">
            <SlidersHorizontal size={15} /> Filtres
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources list */}
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <FileText size={22} className="text-indigo-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base">{r.title}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${formatBadge[r.format] || "bg-slate-100 text-slate-600"}`}>{r.format}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={13} fill="currentColor" className="text-amber-400" />
                      <span className="text-sm font-bold text-gray-900">{r.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{r.subject}</span>
                    <span className="text-xs text-slate-400">par {r.author}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={11} /> {r.date}</span>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{r.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <StatBadge icon={Download} value={r.downloads} label="Téléchargements" />
                      <StatBadge icon={Eye} value={r.views} label="Vues" />
                      <StatBadge icon={BarChart2} value={r.size} label="Taille" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
                        <Eye size={15} /> Aperçu
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all shadow-sm">
                        <Download size={15} /> Télécharger
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune ressource trouvée</p>
            <p className="text-sm mt-1">Essayez d'autres mots-clés ou catégories</p>
          </div>
        )}
      </div>
    </div>
  );
}
