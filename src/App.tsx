import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import AuthPage from "./pages/AuthPage";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import FeedPage from "./pages/FeedPage";
import GroupsPage from "./pages/GroupsPage";
import ResourcesPage from "./pages/ResourcesPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import GroupDetailPage from "./pages/GroupDetailPage";
import SettingsPage from "./pages/SettingsPage";

export type Page = "feed" | "groups" | "resources" | "messages" | "notifications" | "profile" | "settings" | "groupdetail";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page>("feed");
  const [viewedUserId, setViewedUserId] = useState<string | null>(null);
  const [viewedGroupId, setViewedGroupId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleNavigate(page: Page) {
    if (page === "profile") {
      setViewedUserId(null);
    }
    setActivePage(page);
  }

  function handleViewProfile(userId: string) {
    setViewedUserId(userId);
    setActivePage("profile");
  }

  function handleViewGroup(groupId: string) {
    setViewedGroupId(groupId);
    setActivePage("groupdetail");
  }

  const renderPage = () => {
    switch (activePage) {
      case "feed": return <FeedPage onViewProfile={handleViewProfile} onViewGroup={handleViewGroup} />;
      case "groups": return <GroupsPage />;
      case "resources": return <ResourcesPage />;
      case "messages": return <MessagesPage />;
      case "notifications": return <NotificationsPage />;
      case "profile": return <ProfilePage userId={viewedUserId} />;
      case "settings": return <SettingsPage />;
      case "groupdetail": return <GroupDetailPage groupId={viewedGroupId} onBack={() => handleNavigate("feed")} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Topbar activePage={activePage} onNavigate={handleNavigate} onViewProfile={handleViewProfile} />
      <div className="flex pt-16">
        {activePage !== "messages" && (
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        )}
        <main className={`flex-1 ${activePage !== "messages" ? "ml-64" : ""}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
