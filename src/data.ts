/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, DailyAttendance, ChurnMetric } from "./types";

// Fecha actual del sistema establecida al 6 de Junio de 2026
export const CURRENT_DATE_STR = "2026-06-06";

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
  trimestral: 15000, // Equivalente por mes ($45.000 total)
  anual: 12000,      // Equivalente por mes ($144.000 total)
};

export const PRELOADED_MEMBERS: Member[] = [
  {
    id: "M001",
    name: "Mateo Fernández",
    plan: "mensual",
    lastAttendance: "2026-06-05",
    expiryDate: "2026-06-25",
    status: "Activo",
    email: "mateo.fernandez@gmail.com",
    phone: "11-5829-4321",
    registerDate: "2026-01-15",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 3,
  },
  {
    id: "M002",
    name: "Camila Gómez",
    plan: "anual",
    lastAttendance: "2026-06-04",
    expiryDate: "2026-11-10",
    status: "Activo",
    email: "camila.gomez@yahoo.com.ar",
    phone: "11-2345-9876",
    registerDate: "2025-11-10",
    monthlyFee: FEE_STRUCTURE.anual,
    attendanceCountThisMonth: 4,
  },
  {
    id: "M003",
    name: "Santiago Bianchi",
    plan: "mensual",
    lastAttendance: "2026-05-22", // Hace 15 días (En riesgo)
    expiryDate: "2026-06-07", // Vence mañana (Vencimiento próximo)
    status: "En Riesgo",
    email: "santi.bianchi@outlook.com",
    phone: "341-987-6543",
    registerDate: "2026-05-07",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M004",
    name: "Valentina Rossi",
    plan: "mensual",
    lastAttendance: "2026-06-05",
    expiryDate: "2026-06-09", // Vence en 3 días
    status: "Activo",
    email: "valen.rossi@gmail.com",
    phone: "11-6543-2109",
    registerDate: "2026-02-09",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 2,
  },
  {
    id: "M005",
    name: "Lucía Benítez",
    plan: "trimestral",
    lastAttendance: "2026-05-19", // Hace 18 días (En riesgo)
    expiryDate: "2026-07-28",
    status: "En Riesgo",
    email: "lucia.benitez@live.com.ar",
    phone: "351-222-3344",
    registerDate: "2026-04-28",
    monthlyFee: FEE_STRUCTURE.trimestral,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M006",
    name: "Bautista Sosa",
    plan: "mensual",
    lastAttendance: "2026-05-02", // Hace 35 días
    expiryDate: "2026-05-02", // Plan Expirado
    status: "Inactivo",
    email: "bauti.sosa@gmail.com",
    phone: "11-9988-7766",
    registerDate: "2026-04-02",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M007",
    name: "Facundo Álvarez",
    plan: "mensual",
    lastAttendance: "2026-05-17", // Hace 20 días (En riesgo)
    expiryDate: "2026-06-12", // Vence en 6 días
    status: "En Riesgo",
    email: "facu_alvarez@hotmail.com",
    phone: "261-555-6677",
    registerDate: "2025-10-12",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M008",
    name: "Sofía Medina",
    plan: "anual",
    lastAttendance: "2026-06-03",
    expiryDate: "2027-02-15",
    status: "Activo",
    email: "sofia.medina@gmail.com",
    phone: "11-4567-8901",
    registerDate: "2026-02-15",
    monthlyFee: FEE_STRUCTURE.anual,
    attendanceCountThisMonth: 3,
  },
  {
    id: "M009",
    name: "Enzo Colombo",
    plan: "trimestral",
    lastAttendance: "2026-05-12", // Hace 25 días (En riesgo)
    expiryDate: "2026-08-12",
    status: "En Riesgo",
    email: "enzo.colombo@live.com",
    phone: "341-333-4455",
    registerDate: "2026-05-12",
    monthlyFee: FEE_STRUCTURE.trimestral,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M010",
    name: "Martina Domínguez",
    plan: "mensual",
    lastAttendance: "2026-06-06",
    expiryDate: "2026-06-10", // Vence en 4 días
    status: "Activo",
    email: "martina.dominguez@gmail.com",
    phone: "11-8765-4321",
    registerDate: "2026-05-10",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 3,
  },
  {
    id: "M011",
    name: "Lautaro Silva",
    plan: "anual",
    lastAttendance: "2026-05-21", // Hace 16 días (En riesgo)
    expiryDate: "2026-12-18",
    status: "En Riesgo",
    email: "lauti.silva@icloud.com",
    phone: "11-4433-2211",
    registerDate: "2025-12-18",
    monthlyFee: FEE_STRUCTURE.anual,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M012",
    name: "Clara Carrizo",
    plan: "trimestral",
    lastAttendance: "2026-06-01",
    expiryDate: "2026-07-15",
    status: "Activo",
    email: "clara_carrizo@gmail.com",
    phone: "381-445-5667",
    registerDate: "2026-04-15",
    monthlyFee: FEE_STRUCTURE.trimestral,
    attendanceCountThisMonth: 1,
  },
  {
    id: "M013",
    name: "Mariano López",
    plan: "mensual",
    lastAttendance: "2026-04-25", // Hace 42 días
    expiryDate: "2026-05-25", // Expiró hace 12 días
    status: "Inactivo",
    email: "mariano.lopez@yahoo.com",
    phone: "11-1234-5678",
    registerDate: "2026-03-25",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M014",
    name: "Delfina Romero",
    plan: "anual",
    lastAttendance: "2026-05-15", // Hace 22 días (En riesgo)
    expiryDate: "2027-01-10",
    status: "En Riesgo",
    email: "delfu.romero@gmail.com",
    phone: "11-8877-9900",
    registerDate: "2026-01-10",
    monthlyFee: FEE_STRUCTURE.anual,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M015",
    name: "Guido Varela",
    plan: "trimestral",
    lastAttendance: "2026-06-05",
    expiryDate: "2026-08-01",
    status: "Activo",
    email: "guido.varela@gmail.com",
    phone: "11-2233-4455",
    registerDate: "2026-05-01",
    monthlyFee: FEE_STRUCTURE.trimestral,
    attendanceCountThisMonth: 2,
  },
  {
    id: "M016",
    name: "Juana Ortega",
    plan: "mensual",
    lastAttendance: "2026-05-29",
    expiryDate: "2026-06-29",
    status: "Activo",
    email: "juana.ortega@gmail.com",
    phone: "351-778-8990",
    registerDate: "2026-05-29",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 1,
  },
  {
    id: "M017",
    name: "Esteban Castelli",
    plan: "anual",
    lastAttendance: "2026-04-07", // Hace 60 días
    expiryDate: "2027-02-07",
    status: "Inactivo",
    email: "esteban.castelli@live.com",
    phone: "11-3456-7890",
    registerDate: "2026-02-07",
    monthlyFee: FEE_STRUCTURE.anual,
    attendanceCountThisMonth: 0,
  },
  {
    id: "M018",
    name: "Rocío Gatti",
    plan: "mensual",
    lastAttendance: "2026-06-02",
    expiryDate: "2026-07-02",
    status: "Activo",
    email: "rocio.gatti@outlook.com.ar",
    phone: "261-998-8877",
    registerDate: "2026-05-02",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 1,
  },
  {
    id: "M019",
    name: "Federico Peralta",
    plan: "mensual",
    lastAttendance: "2026-06-04",
    expiryDate: "2026-07-04",
    status: "Activo",
    email: "fedep@gmail.com",
    phone: "11-6677-8899",
    registerDate: "2026-04-04",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 3,
  },
  {
    id: "M020",
    name: "Belén Paz",
    plan: "mensual",
    lastAttendance: "2026-04-22", // Hace 45 días
    expiryDate: "2026-05-22", // Expirado
    status: "Inactivo",
    email: "belen.paz@gmail.com",
    phone: "381-889-9001",
    registerDate: "2026-01-22",
    monthlyFee: FEE_STRUCTURE.mensual,
    attendanceCountThisMonth: 0,
  }
];

export const WEEKLY_ATTENDANCE_DATA: DailyAttendance[] = [
  { day: "Lunes", count: 48 },
  { day: "Martes", count: 42 },
  { day: "Miércoles", count: 55 },
  { day: "Jueves", count: 39 },
  { day: "Viernes", count: 64 }, // Día de mayor asistencia
  { day: "Sábado", count: 28 },
  { day: "Domingo", count: 8 }
];

export const CHURN_HISTORY_DATA: ChurnMetric[] = [
  { month: "Ene 2026", activeCount: 50, lostCount: 2, churnRate: 4.0, revenue: 720000 },
  { month: "Feb 2026", activeCount: 52, lostCount: 3, churnRate: 5.7, revenue: 760000 },
  { month: "Mar 2026", activeCount: 58, lostCount: 1, churnRate: 1.7, revenue: 840000 },
  { month: "Abr 2026", activeCount: 60, lostCount: 4, churnRate: 6.6, revenue: 890000 },
  { month: "May 2026", activeCount: 62, lostCount: 3, churnRate: 4.8, revenue: 910000 },
  { month: "Jun 2026", activeCount: 65, lostCount: 2, churnRate: 3.1, revenue: 980050 }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "log_1",
    timestamp: "2026-06-06 08:30:15",
    action: "Inicio de sistema",
    user: "Super Admin",
    role: "Super Admin" as const,
    detail: "Sesión iniciada con éxito en terminal regional argentina.",
  },
  {
    id: "log_2",
    timestamp: "2026-06-06 09:15:32",
    action: "Sincronización Offline",
    user: "Gerente",
    role: "Gerente" as const,
    detail: "Carga exitosa de 20 perfiles pre-cargados de socios.",
  },
  {
    id: "log_3",
    timestamp: "2026-06-06 10:02:11",
    action: "Ingreso Registrado",
    user: "Recepcionista",
    role: "Recepcionista" as const,
    detail: "Ingreso de la socia Martina Domínguez mediante control rápido.",
  },
];