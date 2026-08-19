import { useState } from "react";
import { Code2, ShieldCheck, Flame, Trophy, MapPin, Calendar, Link2, Users, BookOpen, Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, UserPlus, Mail } from "lucide-react";

const badges = [
  { label: "Développeur", icon: Code2, bg: "bg-indigo-100", text: "text-indigo-600" },
  { label: "Sec Expert", icon: ShieldCheck, bg: "bg-violet-100", text: "text-violet-600" },
  { label: "Top Actif", icon: Flame, bg: "bg-orange-100", text: "text-orange-600" },
  { label: "Lauréat 2026", icon: Trophy, bg: "bg-amber-100", text: "text-amber-600" },
];

const stats = [
  { label: "Publications", value: "48" },
  { label: "Abonnés", value: "312" },
  { label: "Abonnements", value: "87" },
  { label: "Ressources", value: "23" },
];

const userPosts = [
  {
    id: 1, time: "Il y a 3 jours",
    content: "Très fière de présenter mon projet de détection d'intrusion par ML lors du séminaire de recherche. Merci à toute l'équipe pour le soutien !",
    likes: 48, comments: 12, shares: 7,
  },
  {
    id: 2, time: "Il y a 1 semaine",
    content: "J'ai partagé mes annales de cryptographie dans la section Ressources. 5 années d'exercices avec corrections complètes. Bonne révision à tous !",
    likes: 91, comments: 28, shares: 34,
  },
  {
    id: 3, time: "Il y a 2 semaines",
    content: "Résultat du CTF HackTheBox : 2ème place au classement étudiant national ! La prochaine édition est en octobre, qui est partant pour former une équipe ?",
    likes: 134, comments: 47, shares: 18,
  },
];

const tabs = ["Publications", "Ressources", "À propos"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Publications");

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Banner + avatar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          {/* Banner */}
          <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700">
            <img
              src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=200&fit=crop&auto=format"
              alt="Bannière"
              className="w-full h-full object-cover mix-blend-overlay opacity-40"
            />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-14 mb-4">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format"
                  alt="Sarah Dupont"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 pb-1">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
                  <Mail size={15} /> Message
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all shadow-sm">
                  <UserPlus size={15} /> Suivre
                </button>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-xl font-bold text-gray-900">Sarah Dupont</h1>
            <p className="text-slate-500 text-sm mt-0.5">M2 Cybersécurité · Université Paris-Saclay</p>

            <p className="text-sm text-slate-600 leading-relaxed mt-3 max-w-xl">
              Passionnée de cybersécurité offensive et d'IA appliquée à la détection d'intrusion. CTF enjoyer, open source contributor et mentor campus.
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin size={13} /> Paris, France</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} /> Membre depuis Septembre 2024</span>
              <a href="#" className="flex items-center gap-1.5 text-indigo-500 hover:underline"><Link2 size={13} /> github.com/sarahdupont</a>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${b.bg} ${b.text} text-xs font-semibold`}>
                    <Icon size={13} />
                    {b.label}
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reputation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                <Trophy size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Score de réputation</p>
                <p className="text-xs text-slate-500">Niveau Expert</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-indigo-600">2 840</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: "85%" }} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Niveau Expert</span>
            <span>Elite dans 160 pts</span>
          </div>
        </div>

        {/* Tabs + Content */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100 px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Publications" && (
            <div className="divide-y divide-slate-100">
              {userPosts.map((post) => (
                <div key={post.id} className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format"
                      alt="Sarah"
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Sarah Dupont</p>
                      <p className="text-xs text-slate-500">{post.time}</p>
                    </div>
                    <button className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.content}</p>
                  <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 flex-1 justify-center transition-all">
                      <Heart size={15} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 flex-1 justify-center transition-all">
                      <MessageCircle size={15} /> {post.comments}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 flex-1 justify-center transition-all">
                      <Share2 size={15} /> {post.shares}
                    </button>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                      <Bookmark size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Ressources" && (
            <div className="p-6 text-center text-slate-400 py-16">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">23 ressources partagées</p>
              <p className="text-sm mt-1">Accessible depuis la section Ressources</p>
            </div>
          )}

          {activeTab === "À propos" && (
            <div className="p-6 space-y-4">
              {[
                { label: "Université", value: "Paris-Saclay — IUT d'Orsay" },
                { label: "Formation", value: "Master 2 Cybersécurité et Sciences du Numérique" },
                { label: "Spécialité", value: "Sécurité Offensive, Détection d'Intrusion, IA & ML" },
                { label: "Langages", value: "Python, C, Rust, Bash, JavaScript" },
                { label: "Certifications", value: "CompTIA Security+, CEH (en cours)" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-sm font-semibold text-slate-500 w-28 shrink-0">{item.label}</span>
                  <span className="text-sm text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
