import { useState, useEffect } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ImageIcon,
  Link2, Send, TrendingUp, Trophy, Calendar, Users, Plus, MapPin, Clock
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
}

const groups = [
  { name: "Dev Web M1", members: 156, color: "from-indigo-400 to-indigo-600" },
  { name: "Cybersécurité", members: 89, color: "from-violet-400 to-violet-600" },
  { name: "IA & Machine Learning", members: 204, color: "from-indigo-500 to-violet-500" },
  { name: "Entrepreneurs Campus", members: 67, color: "from-purple-400 to-pink-500" },
];

const events = [
  { title: "Hackathon DataFest 2026", date: "Vendredi 22 Août", time: "18h00", location: "Salle B204" },
  { title: "Atelier React Avancé", date: "Lundi 25 Août", time: "14h00", location: "Amphi C" },
  { title: "Conférence IA Générative", date: "Mercredi 27 Août", time: "10h00", location: "Grand Amphi" },
];

const topContributors = [
  { name: "Sarah Dupont", score: 2840, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format", rank: 1 },
  { name: "Théo Mercier", score: 2510, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", rank: 2 },
  { name: "Emma Leroy", score: 2190, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", rank: 3 },
  { name: "Alex Martin", score: 1248, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format", rank: 4 },
];

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `Il y a ${diffD}j`;
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  const authorName = post.profiles?.full_name || "Utilisateur";
  const authorRole = post.profiles?.role || "";
  const authorAvatar = post.profiles?.avatar_url ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format";

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Author */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={authorAvatar} alt={authorName} className="w-11 h-11 rounded-xl object-cover" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{authorName}</p>
              <p className="text-xs text-slate-500">{authorRole} · {timeAgo(post.created_at)}</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Content */}
        <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>

        {/* Image */}
        {post.image_url && (
          <div className="rounded-xl overflow-hidden mb-4 bg-slate-100">
            <img src={post.image_url} alt="Publication" className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-100">
          <span>{likes} réactions</span>
          <span>0 commentaires · 0 partages</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-3 flex items-center gap-1">
        <button
          onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
            liked ? "text-red-500 bg-red-50" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
          J'aime
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all flex-1 justify-center">
          <MessageCircle size={16} />
          Commenter
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all flex-1 justify-center">
          <Share2 size={16} />
          Partager
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            saved ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:bg-slate-100"
          }`}
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("id, content, image_url, created_at, profiles(full_name, avatar_url, role)")
      .order("created_at", { ascending: false });

    setPosts((data as unknown as Post[]) || []);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handlePublish() {
    if (!newPostContent.trim()) return;
    setPublishing(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setPublishing(false);
      return;
    }

    await supabase.from("posts").insert({
      user_id: user.id,
      content: newPostContent.trim(),
    });

    setNewPostContent("");
    setShowCompose(false);
    setPublishing(false);
    loadPosts();
  }

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Feed central */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-7 space-y-6">
            {/* Compose */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format"
                  alt="Alex"
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                {showCompose ? (
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    autoFocus
                    placeholder="Quoi de neuf, Alex ? Partagez avec votre communauté..."
                    className="flex-1 min-h-[44px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
                  />
                ) : (
                  <button
                    onClick={() => setShowCompose(true)}
                    className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 text-left hover:border-indigo-300 transition-all"
                  >
                    Quoi de neuf, Alex ? Partagez avec votre communauté...
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-all">
                  <ImageIcon size={15} className="text-green-500" /> Photo
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-all">
                  <Link2 size={15} className="text-blue-500" /> Lien
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-all">
                  <TrendingUp size={15} className="text-orange-500" /> Sondage
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing || !newPostContent.trim()}
                  className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-50"
                >
                  <Send size={14} /> {publishing ? "Publication..." : "Publier"}
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-8">
                Aucune publication pour l'instant. Soyez le premier à publier !
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          {/* Right widgets */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-5 space-y-6">
            {/* Mes Groupes */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Mes groupes</h3>
                <button className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-all">
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {groups.map((g) => (
                  <div key={g.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{g.name[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{g.name}</p>
                      <p className="text-xs text-slate-500">{g.members} membres</p>
                    </div>
                    <Users size={14} className="text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Événements */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Prochains événements</h3>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">3 à venir</span>
              </div>
              <div className="space-y-3">
                {events.map((e) => (
                  <div key={e.title} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                    <p className="text-sm font-semibold text-gray-900 mb-1.5">{e.title}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {e.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {e.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <MapPin size={12} /> {e.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributeurs */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Top Contributeurs</h3>
                <Trophy size={16} className="text-amber-500" />
              </div>
              <div className="space-y-3">
                {topContributors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 text-center ${c.rank === 1 ? "text-amber-500" : c.rank === 2 ? "text-slate-400" : c.rank === 3 ? "text-orange-400" : "text-slate-300"}`}>
                      #{c.rank}
                    </span>
                    <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{c.score.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
