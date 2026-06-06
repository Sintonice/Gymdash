/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlanType = "mensual" | "trimestral" | "anual";

export type MemberStatus = "Activo" | "En Riesgo" | "Inactivo";

export interface Member {
  id: string;
  name: string;
  plan: PlanType;
  lastAttendance: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: MemberStatus;
  email: string;
  phone: string;
  registerDate: string; // YYYY-MM-DD
  monthlyFee: number; // en ARS
  attendanceCountThisMonth: number;
  lastCheckedInTime?: string; // HH:MM:SS
}

export type AdminRole = "Super Admin" | "Gerente" | "Recepcionista";

export interface AuditLogEntry {
  id: string;
  timestamp: string; // YYYY-MM-DD HH:MM:SS
  action: string;
  user: string;
  role: AdminRole;
  detail: string;
}

export interface SystemNotification {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "critical";
  timestamp: string; // HH:MM:SS
  read: boolean;
}

export interface DailyAttendance {
  day: string; // "Lunes", "Martes", etc.
  count: number;
}

export interface ChurnMetric {
  month: string;
  activeCount: number;
  lostCount: number;
  churnRate: number; // porcentaje (bajas / totales)
  revenue: number; // recaudación calculadaizada
}