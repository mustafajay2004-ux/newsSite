import { useState, useEffect, useRef } from "react";
import { Search, Bell, MessageSquare, ChevronDown } from "lucide-react";
import type { Page } from "../App";
import { supabase } from "../lib/supabase";

interface TopbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

interface ProfileResult {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export default function Topbar({ onNavigate }: TopbarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .ilike("full_name", `%${query}%`)
        .limit(5);

      setResults(data || []);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProfile = (id: string) => {
    setShowDropdown(false);
    setQuery("");
    onNavigate("profile");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelectProfile(results[0].id);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="flex items-center h-full px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 w-64 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CL</span>
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">CampusLink</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-xl relative" ref={wrapperRef}>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher des groupes, ressources, personnes..."
              className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </div>

          {showDropdown && query.trim().length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              {results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-400">Aucun résultat</div>
              ) : (
                results.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectProfile(profile.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                  >
                    <img
                      src={profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format"}
                      alt={profile.full_name || "Utilisateur"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {profile.full_name || "Utilisateur"}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onNavigate("messages")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all"
          >
            <MessageSquare size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>
          <button
            onClick={() => onNavigate("notifications")}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className="flex items-center gap-2 pl-3 pr-2 h-10 rounded-xl hover:bg-slate-100 transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format"
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-slate-700">Alex M.</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
