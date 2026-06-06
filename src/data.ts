/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, DailyAttendance, ChurnMetric } from "./types";

export const CURRENT_DATE_STR = new Date().toISOString().split('T')[0];

export function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysRemaining(expiryDate: string): number {
  const current = new Date(CURRENT_DATE_STR);
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - current.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days;
}

export const FEE_STRUCTURE = {
  mensual: 18000,
  trimestral: 15000,
  anual: 12000,
};

export const PRELOADED_MEMBERS: Member[] = [];

export const WEEKLY_ATTENDANCE_DATA: DailyAttendance[] = [
  { day: "Lunes", count: 48 },
  { day: "Martes", count: 42 },
  { day: "Miércoles", count: 55 },
  { day: "Jueves", count: 39 },
  { day: "Viernes", count: 64 },
  { day: "Sábado", count: 28 },
  { day: "Domingo", count: 8 }
];

export const CHURN_HISTORY_DATA: ChurnMetric[] = [];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "log_1",
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    action: "Sistema iniciado",
    user: "Super Admin",
    role: "Super Admin" as const,
    detail: "GymDash iniciado correctamente.",
  },
];
