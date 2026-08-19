import { useState } from "react";
import { Search, Plus, Users, Lock, Globe, ChevronRight } from "lucide-react";

const categories = ["Tous", "Informatique", "Cybersécurité", "Data Science", "IA & ML", "DevOps", "Entrepreneuriat"];

const groups = [
  {
    id: 1, name: "Dev Web M1", description: "Partage de ressources, entraide et projets collaboratifs autour du développement web moderne (React, Node, etc.).",
    members: 156, posts: 342, category: "Informatique", isPrivate: false, joined: true,
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=160&fit=crop&auto=format",
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: 2, name: "Cybersécurité & Ethical Hacking", description: "Espace dédié à la sécurité offensive et défensive, CTFs, analyses de malwares et veille technologique.",
    members: 89, posts: 198, category: "Cybersécurité", isPrivate: true, joined: false,
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=160&fit=crop&auto=format",
    color: "from-violet-500 to-purple-700",
  },
  {
    id: 3, name: "IA & Machine Learning", description: "Exploration des dernières avancées en intelligence artificielle, projets pratiques et lectures d'articles de recherche.",
    members: 204, posts: 517, category: "IA & ML", isPrivate: false, joined: true,
    cover: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=160&fit=crop&auto=format",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    id: 4, name: "Data Science & Visualisation", description: "Analyse de données, visualisation, statistiques et compétitions Kaggle. Python & R bienvenus.",
    members: 138, posts: 289, category: "Data Science", isPrivate: false, joined: false,
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=160&fit=crop&auto=format",
    color: "from-cyan-500 to-indigo-500",
  },
  {
    id: 5, name: "DevOps & Cloud", description: "Kubernetes, Docker, CI/CD, AWS, Azure… Partagez vos configurations, pipelines et retours d'expérience.",
    members: 72, posts: 154, category: "DevOps", isPrivate: false, joined: false,
    cover: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=160&fit=crop&auto=format",
    color: "from-sky-500 to-blue-700",
  },
  {
    id: 6, name: "Entrepreneurs Campus", description: "Pour les étudiants porteurs de projets : pitchs, mentoring, levée de fonds, networking et ressources startup.",
    members: 67, posts: 112, category: "Entrepreneuriat", isPrivate: false, joined: false,
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=160&fit=crop&auto=format",
    color: "from-orange-400 to-rose-500",
  },
];

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = groups.filter((g) => {
    const matchCat = activeCategory === "Tous" || g.category === activeCategory;
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-screen-lg mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Groupes</h1>
            <p className="text-sm text-slate-500 mt-1">Rejoignez des communautés et collaborez avec vos pairs</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
            <Plus size={16} />
            Créer un groupe
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un groupe..."
            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-sm"
          />
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
              {/* Cover */}
              <div className="relative h-32 overflow-hidden">
                <img src={g.cover} alt={g.name} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${g.color} opacity-60`} />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                  {g.isPrivate ? <Lock size={11} /> : <Globe size={11} />}
                  {g.isPrivate ? "Privé" : "Public"}
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg">{g.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-2">{g.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{g.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5"><Users size={13} /> {g.members} membres</span>
                  <span className="flex items-center gap-1.5"><ChevronRight size={13} /> {g.posts} publications</span>
                </div>

                <div className="flex items-center justify-between">
                  {g.joined ? (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-xl">Membre</span>
                  ) : (
                    <span />
                  )}
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ml-auto ${
                    g.joined
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm"
                  }`}>
                    {g.joined ? "Voir le groupe" : (
                      <><Plus size={14} /> Rejoindre</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucun groupe trouvé</p>
            <p className="text-sm mt-1">Essayez une autre catégorie ou recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
