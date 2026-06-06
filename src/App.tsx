import React, { useState } from "react";
import { GymProvider, useGym } from "./context/GymContext";
import { DashboardView } from "./components/DashboardView";
import { MembersView } from "./components/MembersView";
import { ReportView } from "./components/ReportView";
import { AuditLogView } from "./components/AuditLogView";
import { AdminRole, SystemNotification } from "./types";
import { CURRENT_DATE_STR } from "./data";
import { LayoutDashboard, Users, FileText, Shield, Bell, CheckCircle2, ShieldAlert, Dumbbell, WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "socios" | "informe" | "auditoria">("dashboard");
  const { currentRole, setRole, notifications, markNotificationAsRead, clearNotifications, offlineStatus, setOfflineStatus } = useGym();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as AdminRole);
  };

  const getNotificationIcon = (type: SystemNotification["type"]) => {
    switch (type) {
      case "critical":
      case "warning":
        return <ShieldAlert className="h-4 w-4 text-rose-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      default:
        return <Bell className="h-4 w-4 text-sky-400" />;
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardView />;
      case "socios": return <MembersView />;
      case "informe": return <ReportView />;
      case "auditoria": return <AuditLogView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-[#12141c] border-r border-zinc-850 shrink-0 hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-zinc-850 flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-r from-emerald-600 to-[#4ade80] rounded-xl flex items-center justify-center text-[#090a0f]">
              <Dumbbell className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight font-display text-white">GymDash</span>
              <p className="text-[10px] text-zinc-500 tracking-wider">RETENTION SUITE</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition ${
                activeTab === "dashboard" ? "bg-[#22c55e]/10 text-white font-bold border-l-4 border-l-[#22c55e]" : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-[#4ade80]" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("socios")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition ${
                activeTab === "socios" ? "bg-[#22c55e]/10 text-white font-bold border-l-4 border-l-[#22c55e]" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" /> Socios
            </button>
            <button
              onClick={() => setActiveTab("informe")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition ${
                activeTab === "informe" ? "bg-[#22c55e]/10 text-white font-bold border-l-4 border-l-[#22c55e]" : "text-zinc-400"
              }`}
            >
              <FileText className="h-4 w-4" /> Informe del Mes
            </button>
            <button
              onClick={() => setActiveTab("auditoria")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition ${
                activeTab === "auditoria" ? "bg-[#22c55e]/10 text-white font-bold border-l-4 border-l-[#22c55e]" : "text-zinc-400"
              }`}
            >
              <Shield className="h-4 w-4" /> Logs de Auditoría
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-850 space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operando Localmente</span>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#12141c] border-b border-zinc-850 px-6 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-2 md:hidden">
            <Dumbbell className="h-5 w-5 text-[#22c55e]" />
            <span className="text-sm font-bold text-white">GymDash</span>
          </div>

          <div className="hidden md:block">
            <span className="text-xs text-zinc-500 font-mono">Terminal Activa: {CURRENT_DATE_STR}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Offline Switch */}
            <button
              onClick={() => setOfflineStatus(!offlineStatus)}
              className="p-1 px-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-1.5 text-[9px] font-mono text-zinc-400"
            >
              {offlineStatus ? (
                <><WifiOff className="h-3 w-3 text-amber-500" /> <span>LOCAL OFFLINE</span></>
              ) : (
                <><Wifi className="h-3 w-3 text-emerald-400" /> <span>NUBE SYNC</span></>
              )}
            </button>

            {/* Administrador Control */}
            <select
              className="bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 py-1 px-2 rounded-lg font-mono focus:outline-none"
              value={currentRole}
              onChange={handleRoleChange}
            >
              <option value="Super Admin">🛡️ Super Admin</option>
              <option value="Gerente">📊 Gerente</option>
              <option value="Recepcionista">🛎️ Recepcionista</option>
            </select>

            {/* Notifications Popover */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 text-[9px] flex items-center justify-center text-white">{unreadCount}</span>}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsNotifOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-72 bg-[#12141c] border border-zinc-800 rounded-2xl p-4 z-30 space-y-2">
                      <div className="flex justify-between items-center border-b border-zinc-850 pb-1.5 text-xs font-semibold text-white">
                        <span>Notificaciones Recientes</span>
                        <button onClick={clearNotifications} className="text-[9px] text-zinc-500">Limpiar</button>
                      </div>
                      <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className="p-2 bg-zinc-900 border border-zinc-805 rounded text-[11px] text-zinc-300 flex items-start gap-2 cursor-pointer">
                            <span className="mt-0.5">{getNotificationIcon(n.type)}</span>
                            <div>
                              <p>{n.message}</p>
                              <span className="text-[8px] font-mono text-zinc-500">{n.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-12">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="min-h-full">
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#12141c] border-t border-zinc-850 h-16 flex items-center justify-around md:hidden z-20">
        <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === "dashboard" ? "text-[#4ade80] font-bold" : "text-zinc-500"}`}>
          <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
        </button>
        <button onClick={() => setActiveTab("socios")} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === "socios" ? "text-[#4ade80] font-bold" : "text-zinc-500"}`}>
          <Users className="h-4.5 w-4.5" /> Socios
        </button>
        <button onClick={() => setActiveTab("informe")} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === "informe" ? "text-[#4ade80] font-bold" : "text-zinc-500"}`}>
          <FileText className="h-4.5 w-4.5" /> Informe
        </button>
        <button onClick={() => setActiveTab("auditoria")} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === "auditoria" ? "text-[#4ade80] font-bold" : "text-zinc-500"}`}>
          <Shield className="h-4.5 w-4.5" /> Auditoría
        </button>
      </nav>

    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
}