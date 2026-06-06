import React, { useState } from "react";
import { useGym } from "../context/GymContext";
import { getDaysDifference, getDaysRemaining, CURRENT_DATE_STR } from "../data";
import { Award, TrendingDown, Users, Sparkles, Send } from "lucide-react";

export const ReportView: React.FC = () => {
  const { members, currentRole, addNotification } = useGym();
  
  const [reportEmailSubject, setReportEmailSubject] = useState("Resumen de Clases y Retención - Gimnasio GymDash");
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const atRiskCount = members.filter(m => {
    const diff = getDaysDifference(m.lastAttendance, CURRENT_DATE_STR);
    return diff > 14 && diff <= 30;
  }).length;

  const expiringCount = members.filter(m => {
    const days = getDaysRemaining(m.expiryDate);
    return days >= 0 && days <= 7;
  }).length;

  const inactiveCount = members.filter(m => getDaysDifference(m.lastAttendance, CURRENT_DATE_STR) > 30).length;

  const totalCount = members.length || 1;
  const activeCount = members.filter(m => getDaysDifference(m.lastAttendance, CURRENT_DATE_STR) <= 14).length;
  const retentionRate = Math.round((activeCount / totalCount) * 100);

  const triggerWeeklyReport = () => {
    setIsSending(true);
    setSuccessMsg(null);
    setTimeout(() => {
      setIsSending(false);
      setSuccessMsg(`Informes automáticos enviados a los ${totalCount} usuarios registrados.`);
      addNotification("Reportes semanales despachados exitosamente.", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold font-display text-white">Informe Analítico de Retención</h1>
        <p className="text-xs text-zinc-500">Salud comercial del club, alertas de deserción y recomendaciones automáticas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#12141c] border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-950/20 rounded-xl text-rose-500"><TrendingDown className="h-6 w-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Socios Perdidos</span>
            <span className="text-2xl font-bold font-display text-white">{inactiveCount} de {totalCount}</span>
          </div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-950/20 rounded-xl text-[#22c55e]"><Award className="h-6 w-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Día Pico de Asistencias</span>
            <span className="text-2xl font-bold font-display text-white">Viernes</span>
          </div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-sky-950/25 rounded-xl text-sky-400"><Users className="h-6 w-6" /></div>
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Tasa de Retención</span>
            <span className="text-2xl font-bold font-display text-white">{retentionRate}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#12141c] border border-zinc-850 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sparkles className="h-4 w-4 text-[#4ade80]" />
            <h2 className="text-sm font-semibold text-white tracking-wider font-display">RECOMENDACIONES AUTOMATIZADAS</h2>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 bg-[#090a0f]/45 border-l-4 border-l-rose-500 rounded-r-xl">
              <span className="text-[10px] font-bold text-rose-400 block font-mono">PRIORIDAD CRÍTICA</span>
              <h4 className="text-xs font-semibold text-white mt-1">Llamar a los {atRiskCount} socios en riesgo esta semana</h4>
              <p className="text-[11px] text-zinc-500">Contactar de forma personalizada dentro de los 15-30 días sin asitencia previene la deserción en un 25%.</p>
            </div>

            <div className="p-3.5 bg-[#090a0f]/45 border-l-4 border-l-emerald-500 rounded-r-xl">
              <span className="text-[10px] font-bold text-[#4ade80] block font-mono">COMERCIAL</span>
              <h4 className="text-xs font-semibold text-white mt-1">Lanza promociones el día Viernes</h4>
              <p className="text-[11px] text-zinc-500">El flujo de asitencia es más alto los viernes. Aprovecha para impulsar eventos especiales o renovaciones de cuota.</p>
            </div>

            <div className="p-3.5 bg-[#090a0f]/45 border-l-4 border-l-amber-500 rounded-r-xl">
              <span className="text-[10px] font-bold text-amber-500 block font-mono">RENOVACIONES</span>
              <h4 className="text-xs font-semibold text-white mt-1">{expiringCount} socios vencen esta semana, mandales un aviso hoy</h4>
              <p className="text-[11px] text-zinc-500">Mandar recordatorios previos a la fecha de vencimiento garantiza flujos de caja más previsibles.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#12141c] border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white font-display border-b border-zinc-800 pb-3">ALERTAS AUTOMÁTICAS POR EMAIL</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">Configura el asunto del mail semanal y el envío automatizado a la base completa de socios.</p>
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block">Asunto Predeterminado</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#090a0f] border border-zinc-800 text-xs text-zinc-300 rounded-xl"
                value={reportEmailSubject}
                onChange={e => setReportEmailSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-850">
            {currentRole === "Recepcionista" ? (
              <p className="text-xs text-rose-400">La cuenta Recepcionista carece de permisos para procesar reportes automáticos.</p>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={triggerWeeklyReport}
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-600 to-[#4ade80] text-[#090a0f] font-bold text-xs rounded-xl"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSending ? "Enviando reportes..." : "Enviar Reporte Automático de Prueba"}
                </button>
                {successMsg && <div className="p-3 bg-emerald-950/40 text-emerald-300 rounded-xl text-xs">{successMsg}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};