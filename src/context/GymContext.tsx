/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Member, AdminRole, AuditLogEntry, SystemNotification, PlanType, MemberStatus } from "../types";
import { PRELOADED_MEMBERS, INITIAL_AUDIT_LOGS, CURRENT_DATE_STR, FEE_STRUCTURE } from "../data";

interface GymContextType {
  members: Member[];
  currentRole: AdminRole;
  auditLogs: AuditLogEntry[];
  notifications: SystemNotification[];
  offlineStatus: boolean;
  setRole: (role: AdminRole) => void;
  addMember: (memberData: Omit<Member, "id" | "status" | "monthlyFee" | "attendanceCountThisMonth">) => { success: boolean; error?: string };
  editMember: (id: string, updatedData: Partial<Member>) => { success: boolean; error?: string };
  deleteMember: (id: string) => { success: boolean; error?: string };
  registerAttendance: (id: string) => { success: boolean; error?: string };
  clearAuditLogs: () => void;
  addNotification: (message: string, type: SystemNotification["type"]) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  importMembersFromCSV: (csvText: string) => { success: boolean; count: number; error?: string };
  setOfflineStatus: (offline: boolean) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    const local = localStorage.getItem("gym_dash_members");
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return PRELOADED_MEMBERS;
  });

  const [currentRole, setRoleState] = useState<AdminRole>(() => {
    return (localStorage.getItem("gym_dash_role") as AdminRole) || "Super Admin";
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const local = localStorage.getItem("gym_dash_audit_logs");
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const local = localStorage.getItem("gym_dash_notifications");
    if (local) {
      try { return JSON.parse(local); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "notif_1",
        message: "Alerta: 6 socios se encuentran en estado En Riesgo de abandono.",
        type: "warning",
        timestamp: "12:30:10",
        read: false,
      },
      {
        id: "notif_2",
        message: "Recordatorio: 4 planes vencen en los próximos 7 días.",
        type: "info",
        timestamp: "10:05:00",
        read: true,
      }
    ];
  });

  const [offlineStatus, setOfflineStatus] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("gym_dash_members", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("gym_dash_role", currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem("gym_dash_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("gym_dash_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addAuditLog = (action: string, detail: string, activeRole: AdminRole = currentRole) => {
    const now = new Date();
    const formatted = now.toISOString().replace("T", " ").substring(0, 19);
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: formatted,
      action,
      user: activeRole,
      role: activeRole,
      detail,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (message: string, type: SystemNotification["type"]) => {
    const formattedTime = new Date().toTimeString().substring(0, 8);
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      message,
      type,
      timestamp: formattedTime,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const setRole = (role: AdminRole) => {
    setRoleState(role);
    addAuditLog("Cambio de Rol", `Acceso cambiado a nivel administrativo de: ${role}`, role);
    addNotification(`Nivel de acceso cambiado a ${role}`, "info");
  };

  const calculateMemberStatus = (lastAttendance: string): MemberStatus => {
    const current = new Date(CURRENT_DATE_STR);
    const attendance = new Date(lastAttendance);
    const diffTime = current.getTime() - attendance.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) return "Inactivo";
    if (diffDays > 14) return "En Riesgo";
    return "Activo";
  };

  const addMember = (m: Omit<Member, "id" | "status" | "monthlyFee" | "attendanceCountThisMonth">) => {
    const id = `M${String(members.length + 1).padStart(3, "0")}`;
    const status = calculateMemberStatus(m.lastAttendance);
    const newMember: Member = {
      ...m,
      id,
      status,
      monthlyFee: FEE_STRUCTURE[m.plan],
      attendanceCountThisMonth: status === "Activo" ? 1 : 0,
    };
    setMembers((prev) => [...prev, newMember]);
    addAuditLog("Nuevo Socio Registrado", `Socio ${m.name} agregado bajo plan ${m.plan.toUpperCase()}`);
    addNotification(`Nuevo socio registrado: ${m.name}`, "success");
    return { success: true };
  };

  const editMember = (id: string, updatedData: Partial<Member>) => {
    if (currentRole === "Recepcionista") {
      return { success: false, error: "Permiso denegado. Registros de socios protegidos." };
    }
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updatedData };
          if (updatedData.lastAttendance) updated.status = calculateMemberStatus(updatedData.lastAttendance);
          if (updatedData.plan) updated.monthlyFee = FEE_STRUCTURE[updatedData.plan];
          return updated;
        }
        return m;
      })
    );
    addAuditLog("Socio Modificado", `Cambio de atributos en socio ID: ${id}`);
    addNotification(`Atributos de socio guardados`, "success");
    return { success: true };
  };

  const deleteMember = (id: string) => {
    if (currentRole !== "Super Admin") {
      return { success: false, error: "Acceso Denegado. Se requiere nivel administrativo Super Admin." };
    }
    const target = members.find(m => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    addAuditLog("Socio Eliminado", `Registro de ${target?.name || id} removido.`);
    addNotification(`Socio eliminado definitivamente`, "critical");
    return { success: true };
  };

  const registerAttendance = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (!member) return { success: false, error: "Socio no encontrado." };

    const diff = new Date(member.expiryDate).getTime() - new Date(CURRENT_DATE_STR).getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      addNotification(`Acceso Denegado: Planes de ${member.name} expirados.`, "critical");
      addAuditLog("Ingreso Bloqueado", `Intento de acceso por ${member.name} con plan vencido`);
      return { success: false, error: "Plan de membresía vencido. Regularizar cuotas para acceder." };
    }

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            lastAttendance: CURRENT_DATE_STR,
            status: "Activo" as const,
            attendanceCountThisMonth: m.attendanceCountThisMonth + 1,
            lastCheckedInTime: new Date().toTimeString().substring(0, 8),
          };
        }
        return m;
      })
    );
    addAuditLog("Asistencia Registrada", `Check-in exitoso para ${member.name}`);
    addNotification(`Ingreso aprobado para: ${member.name}`, "success");
    return { success: true };
  };

  const clearAuditLogs = () => {
    if (currentRole !== "Super Admin") return;
    setAuditLogs([]);
    addAuditLog("Registros Limpiados", "Historial de trazabilidad vaciado por Super Admin.");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => setNotifications([]);

  const importMembersFromCSV = (csvText: string) => {
    try {
      const lines = csvText.trim().split("\n");
      if (lines.length <= 1) return { success: false, count: 0, error: "Registros insuficientes." };

      const parsed: Member[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const col = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
        const name = col[0] || `Socio de CSV ${i}`;
        const planRaw = (col[1] || "mensual").toLowerCase() as PlanType;
        const expiry = col[2] || "2026-07-06";
        const lastAtt = col[3] || CURRENT_DATE_STR;
        const email = col[4] || `${name.toLowerCase().replace(/\s+/g, "")}@example.com`;
        const phone = col[5] || "11-XXXX-XXXX";

        const status = calculateMemberStatus(lastAtt);

        parsed.push({
          id: `M_CSV_${Date.now()}_${i}`,
          name,
          plan: planRaw,
          lastAttendance: lastAtt,
          expiryDate: expiry,
          status,
          email,
          phone,
          registerDate: CURRENT_DATE_STR,
          monthlyFee: FEE_STRUCTURE[planRaw] || 18000,
          attendanceCountThisMonth: status === "Activo" ? 1 : 0,
        });
      }
      setMembers(prev => [...prev, ...parsed]);
      addAuditLog("Importación Completa", `Carga masiva de ${parsed.length} socios parseados por CSV.`);
      addNotification(`Socios importados: ${parsed.length}`, "success");
      return { success: true, count: parsed.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message };
    }
  };

  return (
    <GymContext.Provider
      value={{
        members, currentRole, auditLogs, notifications, offlineStatus,
        setRole, addMember, editMember, deleteMember, registerAttendance,
        clearAuditLogs, addNotification, markNotificationAsRead, clearNotifications,
        importMembersFromCSV, setOfflineStatus
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) throw new Error("Debe usarse dentro de GymProvider");
  return context;
};