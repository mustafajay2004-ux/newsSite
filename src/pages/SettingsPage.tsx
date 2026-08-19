import { useState } from "react";
import { User, Shield, Bell, Palette, Lock, LogOut, Camera, Save, Eye, EyeOff } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profil", icon: User },
  { id: "security", label: "Sécurité", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Apparence", icon: Palette },
  { id: "privacy", label: "Confidentialité", icon: Lock },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all ${checked ? "bg-indigo-500" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function Input({ placeholder, type = "text", defaultValue = "" }: { placeholder?: string; type?: string; defaultValue?: string }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="h-11 px-4 rounded-xl border border-slate-200 w-full text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder-slate-400"
    />
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPass, setShowPass] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: true, messages: true, mentions: true, groups: false });

  return (
    <div className="pt-8 pb-12">
      <div className="max-w-screen-lg mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <User size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-sm text-slate-500">Gérez votre compte, vos préférences et votre confidentialité</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-56 shrink-0 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-200 mt-3">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-6">Informations personnelles</h2>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format"
                      alt="Avatar"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-sm">
                      <Camera size={13} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Photo de profil</p>
                    <p className="text-xs text-slate-500 mt-0.5">JPG, PNG ou GIF — 2 Mo max</p>
                    <button className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-all">Changer la photo</button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel label="Prénom" required />
                      <Input defaultValue="Sarah" />
                    </div>
                    <div>
                      <FieldLabel label="Nom" required />
                      <Input defaultValue="Dupont" />
                    </div>
                  </div>

                  <div>
                    <FieldLabel label="Adresse email" required />
                    <Input type="email" defaultValue="sarah.dupont@univ-paris-saclay.fr" />
                  </div>

                  <div>
                    <FieldLabel label="Nom d'utilisateur" />
                    <Input defaultValue="sarah_dupont" />
                  </div>

                  <div>
                    <FieldLabel label="Formation / Département" />
                    <Input defaultValue="M2 Cybersécurité — Paris-Saclay" />
                  </div>

                  <div>
                    <FieldLabel label="Biographie" />
                    <textarea
                      defaultValue="Passionnée de cybersécurité offensive et d'IA appliquée à la détection d'intrusion. CTF enjoyer, open source contributor."
                      rows={3}
                      className="px-4 py-3 rounded-xl border border-slate-200 w-full text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <FieldLabel label="Site web / Portfolio" />
                    <Input placeholder="https://votre-site.com" />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
                      <Save size={15} /> Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-6">Sécurité du compte</h2>
                <div className="space-y-6">
                  <div>
                    <FieldLabel label="Mot de passe actuel" />
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        className="h-11 px-4 pr-11 rounded-xl border border-slate-200 w-full text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                        placeholder="••••••••"
                      />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <FieldLabel label="Nouveau mot de passe" />
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <FieldLabel label="Confirmer le nouveau mot de passe" />
                    <Input type="password" placeholder="••••••••" />
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Double authentification (2FA)</p>
                        <p className="text-xs text-slate-500 mt-0.5">Sécurisez votre compte avec une application TOTP</p>
                      </div>
                      <Toggle checked={true} onChange={() => {}} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
                      <Save size={15} /> Mettre à jour
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-6">Préférences de notifications</h2>
                <div className="space-y-4">
                  {[
                    { key: "email", label: "Notifications par email", desc: "Recevez un résumé quotidien par email" },
                    { key: "push", label: "Notifications push", desc: "Alertes en temps réel dans le navigateur" },
                    { key: "messages", label: "Nouveaux messages", desc: "Soyez notifié à chaque nouveau message reçu" },
                    { key: "mentions", label: "Mentions et réponses", desc: "Quand quelqu'un vous mentionne dans un post" },
                    { key: "groups", label: "Activité des groupes", desc: "Nouvelles publications dans vos groupes" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle
                        checked={notifs[item.key as keyof typeof notifs]}
                        onChange={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof notifs] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "appearance" || activeTab === "privacy") && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center text-slate-400">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  {activeTab === "appearance" ? <Palette size={22} /> : <Lock size={22} />}
                </div>
                <p className="font-semibold text-gray-600">
                  {activeTab === "appearance" ? "Personnalisation de l'interface" : "Paramètres de confidentialité"}
                </p>
                <p className="text-sm mt-1">Cette section sera disponible prochainement.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
