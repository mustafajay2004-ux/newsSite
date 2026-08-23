import { useState, useEffect } from "react";
import { ArrowLeft, Users, LogOut, LogIn, Star, Flag } from "lucide-react";
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
      .select("profiles(id, full_name, avatar_url, role)")
      .eq("group_id", groupId);

    const memberList = (membersData || [])
      .map((m: any) => m.profiles)
      .filter((p: any) => p !== null);

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

  useEffect(() => {
    load();
  }, [groupId]);

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

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col items-center text-center border-b border-slate-100">
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
                    <p className="text-sm font-semibold text-gray-900">{m.full_name || "Utilisateur"}</p>
                    <p className="text-xs text-slate-500">{m.role || "Étudiant"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
