import { useState, useEffect, useRef } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ImageIcon,
  Link2, Send, TrendingUp, Trophy, Calendar, Users, Plus, MapPin, Clock, Copy, Repeat2
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

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
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

interface PostCardProps {
  post: Post;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  sharesCount: number;
  onToggleLike: (postId: string, currentlyLiked: boolean) => void;
  isExpanded: boolean;
  comments: Comment[];
  onToggleComments: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCopyLink: (postId: string) => void;
  onRepost: (post: Post) => void;
}

function PostCard({
  post, likesCount, likedByMe, commentsCount, sharesCount, onToggleLike,
  isExpanded, comments, onToggleComments, onAddComment, onCopyLink, onRepost,
}: PostCardProps) {
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const authorName = post.profiles?.full_name || "Utilisateur";
  const authorRole = post.profiles?.role || "";
  const authorAvatar = post.profiles?.avatar_url ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function submitComment() {
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  }

  function handleCopyLink() {
    onCopyLink(post.id);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
    setShowShareMenu(false);
  }

  function handleRepost() {
    onRepost(post);
    setShowShareMenu(false);
  }

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-6">
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

        <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>

        {post.image_url && (
          <div className="rounded-xl overflow-hidden mb-4 bg-slate-100">
            <img src={post.image_url} alt="Publication" className="w-full h-48 object-cover" />
          </div>
        )}

      </div>

      <div className="px-6 py-3 flex items-center gap-6 relative">
        <button
          onClick={() => onToggleComments(post.id)}
          className={`flex items-center gap-2 text-sm font-medium transition-all ${
            isExpanded ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <MessageCircle size={18} />
          {commentsCount}
        </button>

        <div className="relative" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-600 transition-all"
          >
            <Repeat2 size={18} />
            {sharesCount}
          </button>

          {showShareMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 w-56">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700 transition-colors"
              >
                <Copy size={15} /> Copier le lien
              </button>
              <button
                onClick={handleRepost}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-left text-sm text-slate-700 transition-colors"
              >
                <Repeat2 size={15} /> Repartager sur mon profil
              </button>
            </div>
          )}
          {copiedFeedback && (
            <span className="absolute -top-7 left-0 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg whitespace-nowrap">
              Lien copié !
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleLike(post.id, likedByMe)}
          className={`flex items-center gap-2 text-sm font-medium transition-all ${
            likedByMe ? "text-red-500" : "text-slate-500 hover:text-red-500"
          }`}
        >
          <Heart size={18} fill={likedByMe ? "currentColor" : "none"} />
          {likesCount}
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

      {isExpanded && (
        <div className="px-6 pb-5 border-t border-slate-100 pt-4">
          <div className="space-y-3 mb-4">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400">Aucun commentaire pour l'instant.</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <img
                    src={c.profiles?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format"}
                    alt={c.profiles?.full_name || "Utilisateur"}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div className="bg-slate-50 rounded-xl px-3 py-2 flex-1">
                    <p className="text-xs font-semibold text-gray-900">{c.profiles?.full_name || "Utilisateur"}</p>
                    <p className="text-sm text-slate-700">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Écrire un commentaire..."
              className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
            <button
              onClick={submitComment}
              disabled={!commentText.trim()}
              className="w-9 h-9 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50 transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likesByPost, setLikesByPost] = useState<Record<string, number>>({});
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [commentsCountByPost, setCommentsCountByPost] = useState<Record<string, number>>({});
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [sharesCountByPost, setSharesCountByPost] = useState<Record<string, number>>({});
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  async function loadPosts() {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    const { data: postsData } = await supabase
      .from("posts")
      .select("id, content, image_url, created_at, profiles(full_name, avatar_url, role)")
      .order("created_at", { ascending: false });

    const loadedPosts = (postsData as unknown as Post[]) || [];
    setPosts(loadedPosts);

    if (loadedPosts.length === 0) return;

    const postIds = loadedPosts.map((p) => p.id);

    const { data: likesData } = await supabase
      .from("likes")
      .select("post_id, user_id")
      .in("post_id", postIds);

    const likeCounts: Record<string, number> = {};
    const likedByMe = new Set<string>();
    (likesData || []).forEach((like) => {
      likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1;
      if (user && like.user_id === user.id) likedByMe.add(like.post_id);
    });
    setLikesByPost(likeCounts);
    setLikedPostIds(likedByMe);

    const { data: commentsData } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", postIds);

    const commentCounts: Record<string, number> = {};
    (commentsData || []).forEach((c) => {
      commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1;
    });
    setCommentsCountByPost(commentCounts);

    const { data: sharesData } = await supabase
      .from("shares")
      .select("post_id")
      .in("post_id", postIds);

    const shareCounts: Record<string, number> = {};
    (sharesData || []).forEach((s) => {
      shareCounts[s.post_id] = (shareCounts[s.post_id] || 0) + 1;
    });
    setSharesCountByPost(shareCounts);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleToggleLike(postId: string, currentlyLiked: boolean) {
    if (!currentUserId) return;

    if (currentlyLiked) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", currentUserId);
      setLikedPostIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      setLikesByPost((prev) => ({ ...prev, [postId]: (prev[postId] || 1) - 1 }));
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: currentUserId });
      setLikedPostIds((prev) => new Set(prev).add(postId));
      setLikesByPost((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    }
  }

  async function loadComments(postId: string) {
    const { data } = await supabase
      .from("comments")
      .select("id, content, created_at, profiles(full_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    setCommentsByPost((prev) => ({ ...prev, [postId]: (data as unknown as Comment[]) || [] }));
  }

  function handleToggleComments(postId: string) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!commentsByPost[postId]) {
      loadComments(postId);
    }
  }

  async function handleAddComment(postId: string, text: string) {
    if (!currentUserId) return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: currentUserId,
      content: text,
    });

    setCommentsCountByPost((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    loadComments(postId);
  }

  async function handleCopyLink(postId: string) {
    if (!currentUserId) return;

    try {
      await navigator.clipboard.writeText(window.location.origin);
    } catch {
      // clipboard indisponible, on continue quand même à enregistrer le partage
    }

    await supabase.from("shares").insert({ post_id: postId, user_id: currentUserId });
    setSharesCountByPost((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
  }

  async function handleRepost(post: Post) {
    if (!currentUserId) return;

    const authorName = post.profiles?.full_name || "un utilisateur";
    const excerpt = post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content;

    await supabase.from("posts").insert({
      user_id: currentUserId,
      content: `🔁 A partagé la publication de ${authorName} : "${excerpt}"`,
      shared_from_post_id: post.id,
    });

    await supabase.from("shares").insert({ post_id: post.id, user_id: currentUserId });
    setSharesCountByPost((prev) => ({ ...prev, [post.id]: (prev[post.id] || 0) + 1 }));

    loadPosts();
  }

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
          <div className="col-span-12 lg:col-span-7 xl:col-span-7 space-y-6">
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

            {posts.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-8">
                Aucune publication pour l'instant. Soyez le premier à publier !
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  likesCount={likesByPost[post.id] || 0}
                  likedByMe={likedPostIds.has(post.id)}
                  commentsCount={commentsCountByPost[post.id] || 0}
                  sharesCount={sharesCountByPost[post.id] || 0}
                  onToggleLike={handleToggleLike}
                  isExpanded={expandedPostId === post.id}
                  comments={commentsByPost[post.id] || []}
                  onToggleComments={handleToggleComments}
                  onAddComment={handleAddComment}
                  onCopyLink={handleCopyLink}
                  onRepost={handleRepost}
                />
              ))
            )}
          </div>

          <div className="col-span-12 lg:col-span-5 xl:col-span-5 space-y-6">
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
