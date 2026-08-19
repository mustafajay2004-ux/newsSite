import { useState } from "react";
import { Search, Send, Smile, Paperclip, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";

const conversations = [
  {
    id: 1, name: "Sarah Dupont", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    lastMessage: "Merci pour tes retours sur le rapport !", time: "14:32", unread: 2, online: true,
  },
  {
    id: 2, name: "Dev Web M1", avatar: null, isGroup: true, members: 12,
    lastMessage: "Lucas: N'oubliez pas le rendu demain soir", time: "13:15", unread: 5, online: false,
  },
  {
    id: 3, name: "Lucas Bernard", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    lastMessage: "Tu aurais les slides du cours d'hier ?", time: "11:48", unread: 0, online: true,
  },
  {
    id: 4, name: "Emma Leroy", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
    lastMessage: "Hackathon vendredi, on se retrouve à 17h ?", time: "09:20", unread: 0, online: false,
  },
  {
    id: 5, name: "Cybersécurité", avatar: null, isGroup: true, members: 8,
    lastMessage: "Sarah: Nouveau CTF disponible sur HackTheBox", time: "Hier", unread: 0, online: false,
  },
  {
    id: 6, name: "Théo Mercier", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
    lastMessage: "Super présentation aujourd'hui !", time: "Hier", unread: 0, online: false,
  },
];

const messages = [
  { id: 1, from: "Sarah Dupont", self: false, text: "Salut Alex ! J'ai lu ton rapport sur la détection d'intrusion.", time: "14:20", read: true },
  { id: 2, from: "me", self: true, text: "Ah super ! Qu'est-ce que tu en as pensé ?", time: "14:22", read: true },
  { id: 3, from: "Sarah Dupont", self: false, text: "C'est vraiment impressionnant, surtout la partie sur les réseaux de neurones récurrents. 97% de précision c'est énorme !", time: "14:25", read: true },
  { id: 4, from: "me", self: true, text: "Merci beaucoup ! J'ai passé des semaines à optimiser le modèle. Je peux t'envoyer le notebook Jupyter si tu veux explorer les résultats.", time: "14:27", read: true },
  { id: 5, from: "Sarah Dupont", self: false, text: "Oui volontiers ! Et j'aurais une question sur ta méthodologie de preprocessing des données réseau.", time: "14:29", read: true },
  { id: 6, from: "me", self: true, text: "Bien sûr, je t'explique tout ça avec plaisir. Je t'envoie le notebook ce soir.", time: "14:31", read: true },
  { id: 7, from: "Sarah Dupont", self: false, text: "Merci pour tes retours sur le rapport !", time: "14:32", read: false },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar conversations */}
      <div className="w-80 shrink-0 bg-white border-r border-slate-200/80 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-gray-900 mb-3 text-base">Messages</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une conversation..."
              className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                activeConv.id === conv.id ? "bg-indigo-50" : "hover:bg-slate-100"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                {conv.avatar ? (
                  <img src={conv.avatar} alt={conv.name} className="w-11 h-11 rounded-xl object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{conv.name[0]}</span>
                  </div>
                )}
                {conv.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-gray-900 truncate">{conv.name}</span>
                  <span className="text-[11px] text-slate-400 shrink-0 ml-2">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 truncate">{conv.lastMessage}</span>
                  {conv.unread > 0 && (
                    <span className="shrink-0 min-w-5 h-5 bg-indigo-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        {/* Chat header */}
        <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {activeConv.avatar ? (
              <img src={activeConv.avatar} alt={activeConv.name} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <span className="text-white font-bold">{activeConv.name[0]}</span>
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm">{activeConv.name}</p>
              <p className="text-xs text-green-500 font-medium">{activeConv.online ? "En ligne" : "Hors ligne"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all"><Phone size={18} /></button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all"><Video size={18} /></button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${msg.self ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!msg.self && (
                  <img
                    src={activeConv.avatar || ""}
                    alt=""
                    className="w-7 h-7 rounded-xl object-cover mb-0.5"
                  />
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.self
                    ? "bg-indigo-500 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-gray-800 rounded-bl-md shadow-sm"
                }`}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 text-[11px] text-slate-400 ${msg.self ? "justify-end" : ""}`}>
                  <span>{msg.time}</span>
                  {msg.self && (
                    msg.read
                      ? <CheckCheck size={12} className="text-indigo-400" />
                      : <Check size={12} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="bg-white border-t border-slate-200/80 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all shrink-0">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setInput("")}
                placeholder="Écrire un message..."
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all">
                <Smile size={16} />
              </button>
            </div>
            <button
              onClick={() => setInput("")}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white shrink-0 transition-all shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
