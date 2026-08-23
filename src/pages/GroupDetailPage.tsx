import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Users, LogOut, LogIn, Star, Flag, Crown, Send, MessageSquare, Info } from "lucide-react";
import { supabase } from "../lib/supabase";

interface GroupDetailPageProps {
  groupId: string | null;
  onBack: () => void;
}

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  color: string;
  created_by: string;
}

interface Member {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  is_admin: boolean;
}

interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function GroupDetailPage({ groupId, onBack }: GroupDetailPageProps) {
  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"infos" | "discussion">("infos");
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function load() {
    if (!groupId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    const { data: groupData } = await supabase
      .from("groups")
      .select("id, name, description, photo_url, color, created_by")
      .eq("id", groupId)
      .single();

    setGroup(groupData);

    const { data: membersData } = await supabase
      .from("group_members")
      .select("is_admin, profiles(id, full_name, avatar_url, role)")
      .eq("group_id", groupId);

    const memberList = (membersData || [])
      .filter((m: any) => m.profiles !== null)
      .map((m: any) => ({ ...m.profiles, is_admin: m.is_admin }));

    setMembers(memberList);
    setIsMember(user ? memberList.some((m: Member) => m.id === user.id) : false);

    if (user) {
      const { data: favData } = await supabase
        .from("group_favorites")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .maybeSingle();
      setIsFavorite(!!favData);
    }

    setLoading(false);
  }

  async function loadMessages() {
    if (!groupId) return;

    const { data } = await supabase
      .from("group_messages")
      .select("id, content, created_at, user_id, profiles(full_name, avatar_url)")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    setMessages((data as unknown as GroupMessage[]) || []);
  }

  useEffect(() => {
    load();
  }, [groupId]);

  useEffect(() => {
    if (activeTab === "discussion" && isMember) {
      loadMessages();
    }
  }, [activeTab, isMember, groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleJoin() {
    if (!groupId || !currentUserId) return;
    setActionLoading(true);
    await supabase.from("group_members").insert({ group_id: groupId, user_id: currentUserId });
    setActionLoading(false);
    load();
  }

  async function handleLeave() {
    if (!groupId || !currentUserId) return;
    setActionLoading(true);
    await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", currentUserId);
    setActionLoading(false);
    load();
  }

  async function toggleFavorite() {
    if (!groupId || !currentUserId) return;

    if (isFavorite) {
      await supabase.from("group_favorites").delete().eq("group_id", groupId).eq("user_id", currentUserId);
      setIsFavorite(false);
    } else {
      await supabase.from("group_favorites").insert({ group_id: groupId, user_id: currentUserId });
      setIsFavorite(true);
    }
  }

  async function submitReport() {
    if (!groupId || !currentUserId) return;

    await supabase.from("group_reports").insert({
      group_id: groupId,
      reported_by: currentUserId,
      reason: reportReason.trim() || null,
    });

    setReportReason("");
    setShowReportForm(false);
    setReportSent(true);
    setTimeout(() => setReportSent(false), 3000);
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !currentUserId || !groupId) return;
    setSendingMessage(true);

    await supabase.from("group_messages").insert({
      group_id: groupId,
      user_id: currentUserId,
      content: newMessage.trim(),
    });

    setNewMessage("");
    setSendingMessage(false);
    loadMessages();
  }

  if (loading) {
    return <div className="pt-16 text-center text-slate-400 text-sm">Chargement du groupe...</div>;
  }

  if (!group) {
    return <div className="pt-16 text-center text-slate-400 text-sm">Groupe introuvable.</div>;
  }

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4 transition-all"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        {reportSent && (
          <div className="mb-4 px-4 py-2.5 bg-green-50 text-green-700 text-sm rounded-xl">
            Signalement envoyé, merci.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col items-center text-center border-b border-slate-100 relative">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <button
                onClick={toggleFavorite}
                title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                className={`p-2 rounded-full transition-all ${
                  isFavorite ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:bg-slate-100 hover:text-amber-500"
                }`}
              >
                <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                title="Signaler ce groupe"
                className="p-2 rounded-full text-slate-300 hover:bg-slate-100 hover:text-red-500 transition-all"
              >
                <Flag size={18} />
              </button>
            </div>

            {showReportForm && (
              <div className="absolute top-14 right-4 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-10 text-left">
                <p className="text-xs font-semibold text-gray-900 mb-2">Signaler ce groupe</p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Raison (optionnel)"
                  className="w-full min-h-[60px] px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
                />
                <button
                  onClick={submitReport}
                  className="w-full mt-2 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all"
                >
                  Envoyer le signalement
                </button>
              </div>
            )}
            {group.photo_url ? (
              <img src={group.photo_url} alt={group.name} className="w-24 h-24 rounded-2xl object-cover mb-4" />
            ) : (
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center mb-4`}>
                <span className="text-white text-3xl font-bold">{group.name[0]}</span>
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="text-sm text-slate-600 mt-2 max-w-md">{group.description}</p>
            )}
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <Users size={13} /> {members.length} membre{members.length > 1 ? "s" : ""}
            </p>

            <button
              onClick={isMember ? handleLeave : handleJoin}
              disabled={actionLoading}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                isMember
                  ? "text-red-600 border border-red-200 hover:bg-red-50"
                  : "text-white bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isMember ? <LogOut size={15} /> : <LogIn size={15} />}
              {actionLoading ? "..." : isMember ? "Quitter le groupe" : "Rejoindre le groupe"}
            </button>
          </div>

          {isMember && (
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab("infos")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "infos" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Info size={15} /> Infos
              </button>
              <button
                onClick={() => setActiveTab("discussion")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "discussion" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <MessageSquare size={15} /> Discussion
              </button>
            </div>
          )}

          {activeTab === "infos" && (
            <div className="p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Membres</h2>
              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <img
                      src={m.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format"}
                      alt={m.full_name || "Utilisateur"}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        {m.full_name || "Utilisateur"}
                        {m.is_admin && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Crown size={10} /> Admin
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{m.role || "Étudiant"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "discussion" && isMember && (
            <div className="flex flex-col h-[420px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 mt-8">Aucun message pour l'instant. Lancez la discussion !</p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.user_id === currentUserId;
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                        {!isMe && (
                          <img
                            src={msg.profiles?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format"}
                            alt={msg.profiles?.full_name || "Utilisateur"}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        )}
                        <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                          {!isMe && (
                            <span className="text-[11px] text-slate-400 mb-0.5 ml-1">{msg.profiles?.full_name || "Utilisateur"}</span>
                          )}
                          <div
                            className={`px-3 py-2 rounded-2xl text-sm ${
                              isMe ? "bg-indigo-500 text-white rounded-br-sm" : "bg-slate-100 text-slate-700 rounded-bl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Écrire un message..."
                  className="flex-1 h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !newMessage.trim()}
                  className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
