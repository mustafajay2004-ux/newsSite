import { useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import FeedPage from "./pages/FeedPage";
import GroupsPage from "./pages/GroupsPage";
import ResourcesPage from "./pages/ResourcesPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

export type Page = "feed" | "groups" | "resources" | "messages" | "notifications" | "profile" | "settings";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("feed");

  const renderPage = () => {
    switch (activePage) {
      case "feed": return <FeedPage />;
      case "groups": return <GroupsPage />;
      case "resources": return <ResourcesPage />;
      case "messages": return <MessagesPage />;
      case "notifications": return <NotificationsPage />;
      case "profile": return <ProfilePage />;
      case "settings": return <SettingsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Topbar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex pt-16">
        {activePage !== "messages" && (
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
        )}
        <main className={`flex-1 ${activePage !== "messages" ? "ml-64" : ""}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
