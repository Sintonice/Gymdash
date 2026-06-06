import React, { useState } from "react";
import { useGym } from "../context/GymContext";
import { getDaysDifference, getDaysRemaining, CURRENT_DATE_STR, WEEKLY_ATTENDANCE_DATA, CHURN_HISTORY_DATA } from "../data";
import { Users, AlertTriangle, UserCheck, UserMinus, Calendar, TrendingUp, Activity } from "lucide-react";
import { motion } from "motion/react";

export const DashboardView: React.FC = () => {
  const { members, registerAttendance } = useGym();
  const [selectedChartBar, setSelectedChartBar] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<"revenue" | "churn">("revenue");

  // Cálculos de KPIs
  const totalCount = members.length;
  const activeCount = members.filter(m => getDaysDifference(m.lastAttendance, CURRENT_DATE_STR) <= 14).length;
  const atRiskCount = members.filter(m => {
    const diff = getDaysDifference(m.lastAttendance, CURRENT_DATE_STR);
    return diff > 14 && diff <= 30;
  }).length;
  const inactiveCount = members.filter(m => getDaysDifference(m.lastAttendance, CURRENT_DATE_STR) > 30).length;

  const atRiskMembers = members
    .filter(m => {
      const diff = getDaysDifference(m.lastAttendance, CURRENT_DATE_STR);
      return diff > 14 && diff <= 30;
    })
    .map(m => ({ ...m, daysSinceLastVisit: getDaysDifference(m.lastAttendance, CURRENT_DATE_STR) }))
    .sort((a, b) => b.daysSinceLastVisit - a.daysSinceLastVisit);

  const expiringMembers = members
    .filter(m => {
      const days = getDaysRemaining(m.expiryDate);
      return days >= 0 && days <= 7;
    })
    .map(m => ({ ...m, daysRemaining: getDaysRemaining(m.expiryDate) }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const currentRevenue = members
    .filter(m => m.status !== "Inactivo")
    .reduce((sum, m) => sum + m.monthlyFee, 0);

  const [checkInSearch, setCheckInSearch] = useState("");
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInSearch.trim()) return;

    const matched = members.find(
      (m) => m.id.toLowerCase() === checkInSearch.toLowerCase().trim() ||
             m.name.toLowerCase().includes(checkInSearch.toLowerCase().trim())
    );

    if (!matched) {
      setCheckInResult({
        success: false,
        message: `Socio con ID o Nombre "${checkInSearch}" no encontrado.`,
      });
      return;
    }

    const res = registerAttendance(matched.id);
    if (res.success) {
      setCheckInResult({ success: true, message: `¡Ingreso aprobado! ${matched.name} ha ingresado.` });
    } else {
      setCheckInResult({ success: false, message: `Denegado: ${res.error}` });
    }
    setCheckInSearch("");
    setTimeout(() => setCheckInResult(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Banner Superior / Check-In */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#12141c] border border-zinc-800/80 p-5 rounded-2xl ambient-glow">
        <div>
          <h1 className="text-2xl font-semibold font-display tracking-tight text-white flex items-center gap-2">
            Panel de Control <span className="text-xs font-mono font-normal uppercase py-1 px-2.5 rounded bg-zinc-800 border border-zinc-700 text-[#4ade80]">MODO OFFLINE SINCRO</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Resumen de retención, vencimientos y métricas de retención al <strong className="text-zinc-200">6 de junio de 2026</strong>.
          </p>
        </div>

        <form onSubmit={handleQuickCheckIn} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
              <Activity className="h-4 w-4 text-[#22c55e]" />
            </span>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 bg-[#090a0f]/80 border border-zinc-800 focus:outline-none focus:border-[#22c55e] text-xs rounded-xl text-zinc-200"
              placeholder="Ingreso rápido por ID o Nombre..."
              value={checkInSearch}
              onChange={(e) => setCheckInSearch(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-[#090a0f] font-semibold text-xs rounded-xl"
          >
            Entrar
          </button>
        </form>
      </div>

      {checkInResult && (
        <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
          checkInResult.success ? "bg-emerald-950/40 text-emerald-300 border-emerald-900" : "bg-red-950/40 text-red-300 border-red-900"
        }`}>
          <span>{checkInResult.message}</span>
        </div>
      )}

      {/* Tarjetas grandes de contadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12141c] border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Socios Totales</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">{totalCount}</span>
          </div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Socios Activos</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">{activeCount}</span>
            <span className="text-[10px] text-zinc-400 font-mono">{"<= 14 d"}</span>
          </div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Socios en Riesgo</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">{atRiskCount}</span>
            <span className="text-[10px] text-zinc-400 font-mono">{"> 14 d"}</span>
          </div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800/80 p-5 rounded-2xl">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Socios Inactivos</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-white">{inactiveCount}</span>
            <span className="text-[10px] text-zinc-400 font-mono">{"> 30 d"}</span>
          </div>
        </div>
      </div>

      {/* Secciones de Socios en Riesgo y Vencimientos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* At Risk List */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-md font-semibold text-white tracking-wide font-display flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" /> SOCIOS EN RIESGO
            </h2>
            <span className="text-xs font-mono bg-rose-950/30 border border-rose-900/40 text-rose-400 px-2.5 py-1 rounded">
              {atRiskMembers.length} Socios
            </span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {atRiskMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-[#090a0f]/50 border border-zinc-800 rounded-xl">
                <div>
                  <h3 className="text-xs font-medium text-zinc-200">{member.name}</h3>
                  <p className="text-[10px] text-zinc-500">Plan: {member.plan} • Última visita: {member.lastAttendance}</p>
                </div>
                <span className="text-[10px] font-semibold bg-red-950/50 text-red-400 border border-red-900/40 px-2.5 py-1 rounded-full">
                  hace {member.daysSinceLastVisit} días
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Expirations */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-md font-semibold text-white tracking-wide font-display flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" /> VENCIMIENTO PRÓXIMO
            </h2>
            <span className="text-xs font-mono bg-amber-950/25 border border-amber-900/40 text-amber-500 px-2.5 py-1 rounded">
              {expiringMembers.length} Socios
            </span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
            {expiringMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-[#090a0f]/50 border border-zinc-800 rounded-xl">
                <div>
                  <h3 className="text-xs font-medium text-zinc-200">{member.name}</h3>
                  <p className="text-[10px] text-zinc-500">Vence: {member.expiryDate}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                  member.daysRemaining <= 1 ? "bg-red-950/40 text-red-400" : "bg-amber-950/40 text-amber-400"
                }`}>
                  {member.daysRemaining === 0 ? "Vence hoy" : `restan ${member.daysRemaining} d`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos Semanales e Históricos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Asistencia Semanal */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-semibold text-white font-display">ASISTENCIA SEMANAL</h2>
            <span className="text-[10px] text-[#4ade80] font-mono">Pico: Viernes (64)</span>
          </div>

          <div className="flex items-end justify-between h-[180px] pt-6 relative border-b border-zinc-800 pb-1">
            {WEEKLY_ATTENDANCE_DATA.map((item) => {
              const heightPercentage = Math.round((item.count / 70) * 100);
              const isPeak = item.day === "Viernes";
              const isSelected = selectedChartBar === item.day;

              return (
                <div
                  key={item.day}
                  className="flex flex-col items-center flex-1 cursor-pointer group"
                  onClick={() => setSelectedChartBar(isSelected ? null : item.day)}
                >
                  <div style={{ height: `${heightPercentage}%` }} className={`w-8 rounded-t-lg transition-all ${
                    isPeak ? "bg-gradient-to-t from-emerald-600 to-[#4ade80]" : "bg-zinc-800"
                  } ${isSelected ? "ring-2 ring-[#22c55e]" : ""}`} />
                  <span className="text-[10px] mt-2 font-mono text-zinc-500">{item.day.substring(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Churn & Proyecciones Financieras */}
        <div className="bg-[#12141c] border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-semibold text-white font-display">PROYECCIONES Y CHURN</h2>
            <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
              <button
                onClick={() => setActiveMetricTab("revenue")}
                className={`px-2.5 py-1 rounded-md ${activeMetricTab === "revenue" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
              >
                Finanzas
              </button>
              <button
                onClick={() => setActiveMetricTab("churn")}
                className={`px-2.5 py-1 rounded-md ${activeMetricTab === "churn" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}
              >
                Deserción
              </button>
            </div>
          </div>

          {activeMetricTab === "revenue" ? (
            <div className="space-y-4">
              <div className="p-3 bg-[#090a0f]/50 border border-zinc-800 rounded-xl">
                <span className="text-[10px] uppercase text-zinc-500 font-mono">Recaudación Proyectada Junio 2026</span>
                <div className="text-lg font-bold text-[#4ade80] font-display mt-1">
                  ${currentRevenue.toLocaleString("es-AR")} ARS
                </div>
              </div>
              <div className="h-[100px] border-b border-zinc-800/40 relative">
                <p className="text-[10px] text-zinc-400 absolute bottom-1 right-2">Permanencia Media: 9.3 meses</p>
                <div className="w-full h-full bg-gradient-to-t from-[#22c55e]/10 to-transparent rounded" />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] font-mono text-zinc-500">
                    <th className="py-2">Mes</th>
                    <th className="py-2 text-center">Bajas</th>
                    <th className="py-2 text-right">Tasa Churn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-xs text-zinc-400">
                  {CHURN_HISTORY_DATA.map((entry) => (
                    <tr key={entry.month}>
                      <td className="py-2 font-mono">{entry.month}</td>
                      <td className="py-2 text-center font-mono">{entry.lostCount}</td>
                      <td className="py-2 text-right font-mono font-bold text-rose-400">{entry.churnRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};