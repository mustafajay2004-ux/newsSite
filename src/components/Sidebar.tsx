import {
  Home, Users, BookOpen, Bell, User, Settings, LogOut, TrendingUp, Award
} from "lucide-react";
import type { Page } from "../App";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: "feed", label: "Accueil", icon: Home },
  { page: "groups", label: "Groupes", icon: Users },
  { page: "resources", label: "Ressources", icon: BookOpen },
  { page: "notifications", label: "Notifications", icon: Bell },
  { page: "profile", label: "Profil", icon: User },
];

const bottomItems: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: "settings", label: "Paramètres", icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200/80 flex flex-col z-40">
      {/* User card */}
      <div className="p-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format"
            alt="Alex Martin"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">Alex Martin</p>
            <p className="text-xs text-slate-500 truncate">M1 Informatique</p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
        {navItems.map(({ page, label, icon: Icon }) => {
          const active = activePage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}

        <div className="pt-4">
          <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Activité</p>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 mt-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Score de réputation</p>
                <p className="text-xs text-slate-500">Niveau Avancé</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: "72%" }} />
              </div>
              <span className="text-xs font-bold text-indigo-600">1 248</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Mes Groupes</p>
          {["Dev Web M1", "Cybersécurité", "IA & ML"].map((g) => (
            <button key={g} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-all">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{g[0]}</span>
              </div>
              <span className="truncate">{g}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-200/80 space-y-1">
        {bottomItems.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activePage === page
                ? "bg-indigo-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
