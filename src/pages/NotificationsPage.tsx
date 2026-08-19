import { Bell, Heart, MessageSquare, Award, FileText, UserPlus, Check, Trash2, Settings } from "lucide-react";

const notifications = [
  {
    id: 1, type: "like", read: false,
    actor: "Sarah Dupont", actorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    content: "a aimé votre publication sur l'architecture microservices",
    time: "Il y a 2 min",
    icon: Heart, iconBg: "bg-red-100", iconColor: "text-red-500",
  },
  {
    id: 2, type: "comment", read: false,
    actor: "Lucas Bernard", actorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    content: "a commenté votre ressource : « Excellente explication de la partie cryptographie asymétrique ! »",
    time: "Il y a 15 min",
    icon: MessageSquare, iconBg: "bg-blue-100", iconColor: "text-blue-500",
  },
  {
    id: 3, type: "badge", read: false,
    actor: "CampusLink", actorAvatar: null,
    content: "Vous avez débloqué le badge « Expert Contributeur » — 1 000 points de réputation atteints !",
    time: "Il y a 1h",
    icon: Award, iconBg: "bg-amber-100", iconColor: "text-amber-500",
  },
  {
    id: 4, type: "resource", read: true,
    actor: "Emma Leroy", actorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
    content: "a partagé une nouvelle ressource dans le groupe IA & ML : « Guide Pandas & Plotly »",
    time: "Il y a 3h",
    icon: FileText, iconBg: "bg-indigo-100", iconColor: "text-indigo-500",
  },
  {
    id: 5, type: "follow", read: true,
    actor: "Théo Mercier", actorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
    content: "commence à vous suivre",
    time: "Il y a 5h",
    icon: UserPlus, iconBg: "bg-violet-100", iconColor: "text-violet-500",
  },
  {
    id: 6, type: "comment", read: true,
    actor: "Marie Chen", actorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&auto=format",
    content: "a répondu à votre commentaire dans le groupe Cybersécurité",
    time: "Hier, 18:40",
    icon: MessageSquare, iconBg: "bg-blue-100", iconColor: "text-blue-500",
  },
  {
    id: 7, type: "like", read: true,
    actor: "Karim Benali", actorAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&auto=format",
    content: "et 14 autres personnes ont aimé votre publication sur les annales d'algorithmique",
    time: "Hier, 14:20",
    icon: Heart, iconBg: "bg-red-100", iconColor: "text-red-500",
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Bell size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-slate-500">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all border border-slate-200">
              <Check size={15} /> Tout marquer lu
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all border border-slate-200">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {["Toutes", "Non lues", "Mentions", "Groupes"].map((t, i) => (
            <button key={t} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              i === 0
                ? "bg-indigo-500 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-start gap-4 transition-all hover:shadow-md ${
                  !notif.read ? "bg-indigo-50/50 border-indigo-100" : ""
                }`}
              >
                {/* Avatar + icon */}
                <div className="relative shrink-0">
                  {notif.actorAvatar ? (
                    <img src={notif.actorAvatar} alt={notif.actor} className="w-11 h-11 rounded-xl object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <Bell size={18} className="text-white" />
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${notif.iconBg} flex items-center justify-center border-2 border-white`}>
                    <Icon size={12} className={notif.iconColor} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    <span className="font-semibold">{notif.actor}</span>{" "}
                    <span className="text-slate-600">{notif.content}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
