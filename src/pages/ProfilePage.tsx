import { useState, useEffect } from "react";
import { Code2, ShieldCheck, Flame, Trophy, Calendar, Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, UserPlus, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ProfilePageProps {
  userId: string | null;
}

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
}

interface UserPost {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  shares: number;
}

const badges = [
  { label: "Développeur", icon: Code2, bg: "bg-indigo-100", text: "text-indigo-600" },
  { label: "Sec Expert", icon: ShieldCheck, bg: "bg-violet-100", text: "text-violet-600" },
  { label: "Top Actif", icon: Flame, bg: "bg-orange-100", text: "text-orange-600" },
  { label: "Lauréat 2026", icon: Trophy, bg: "bg-amber-100", text: "text-amber-600" },
];

const tabs = ["Publications", "Ressources", "À propos"];

function formatMemberSince(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("Publications");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const targetId = userId || user?.id;
      if (!targetId) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role, created_at")
        .eq("id", targetId)
        .single();

      setProfile(profileData);

      const { data: postsData } = await supabase
        .from("posts")
        .select("id, content, created_at")
        .eq("user_id", targetId)
        .order("created_at", { ascending: false });

      const loadedPosts = postsData || [];
      const postIds = loadedPosts.map((p) => p.id);

      let likeCounts: Record<string, number> = {};
      let commentCounts: Record<string, number> = {};
      let shareCounts: Record<string, number> = {};

      if (postIds.length > 0) {
        const [{ data: likesData }, { data: commentsData }, { data: sharesData }] = await Promise.all([
          supabase.from("likes").select("post_id").in("post_id", postIds),
          supabase.from("comments").select("post_id").in("post_id", postIds),
          supabase.from("shares").select("post_id").in("post_id", postIds),
        ]);

        (likesData || []).forEach((l) => { likeCounts[l.post_id] = (likeCounts[l.post_id] || 0) + 1; });
        (commentsData || []).forEach((c) => { commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1; });
        (sharesData || []).forEach((s) => { shareCounts[s.post_id] = (shareCounts[s.post_id] || 0) + 1; });
      }

      setPosts(loadedPosts.map((p) => ({
        id: p.id,
        content: p.content,
        created_at: p.created_at,
        likes: likeCounts[p.id] || 0,
        comments: commentCounts[p.id] || 0,
        shares: shareCounts[p.id] || 0,
      })));

      setLoading(false);
    }

    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="pt-16 text-center text-slate-400 text-sm">Chargement du profil...</div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-16 text-center text-slate-400 text-sm">Profil introuvable.</div>
    );
  }

  const isOwnProfile = profile.id === currentUserId;
  const displayName = profile.full_name || "Utilisateur";
  const avatarUrl = profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format";

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Banner + avatar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700">
            <img
              src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=200&fit=crop&auto=format"
              alt="Bannière"
              className="w-full h-full object-cover mix-blend-overlay opacity-40"
            />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-14 mb-4">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              </div>
              {!isOwnProfile && (
                <div className="flex items-center gap-2 pb-1">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
                    <Mail size={15} /> Message
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all shadow-sm">
                    <UserPlus size={15} /> Suivre
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{profile.role || "Étudiant"}</p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar size={13} /> Membre depuis {formatMemberSince(profile.created_at)}</span>
            </div>

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

            <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{posts.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Publications</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">0</p>
                <p className="text-xs text-slate-500 mt-0.5">Abonnés</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">0</p>
                <p className="text-xs text-slate-500 mt-0.5">Abonnements</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">0</p>
                <p className="text-xs text-slate-500 mt-0.5">Ressources</p>
              </div>
            </div>
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
              {posts.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">Aucune publication pour l'instant.</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={avatarUrl} alt={displayName} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                        <p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <button className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 flex-1 justify-center">
                        <Heart size={15} /> {post.likes}
                      </span>
                      <span className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 flex-1 justify-center">
                        <MessageCircle size={15} /> {post.comments}
                      </span>
                      <span className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 flex-1 justify-center">
                        <Share2 size={15} /> {post.shares}
                      </span>
                      <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                        <Bookmark size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Ressources" && (
            <div className="p-6 text-center text-slate-400 py-16">
              <p className="font-medium">Aucune ressource pour l'instant</p>
            </div>
          )}

          {activeTab === "À propos" && (
            <div className="p-6 text-center text-slate-400 py-16">
              <p className="font-medium">Informations à venir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
