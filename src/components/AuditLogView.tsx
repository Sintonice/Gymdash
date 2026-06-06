import React, { useState } from "react";
import { useGym } from "../context/GymContext";
import { ShieldAlert, Trash2, HardDriveDownload } from "lucide-react";

export const AuditLogView: React.FC = () => {
  const { auditLogs, currentRole, clearAuditLogs, addNotification } = useGym();
  const [logFilter, setLogFilter] = useState("Todos");

  const filteredLogs = auditLogs.filter(log => {
    if (logFilter === "Todos") return true;
    if (logFilter === "Asistencia") return log.action.includes("Asistencia") || log.action.includes("Ingreso");
    if (logFilter === "Socio") return log.action.includes("Socio") || log.action.includes("Importación");
    return true;
  });

  const handleExportLogs = () => {
    const headers = "ID,Timestamp,Accion,Usuario,Rol,Detalles\n";
    const rows = auditLogs.map(l => `${l.id},"${l.timestamp}","${l.action}","${l.user}","${l.role}","${l.detail}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gymdash_auditoria_${Date.now()}.csv`;
    link.click();
    addNotification("Reportes de auditoría exportados.", "info");
  };

  if (currentRole === "Recepcionista") {
    return (
      <div className="bg-[#12141c] border border-zinc-800 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-4 my-12">
        <div className="mx-auto w-12 h-12 bg-rose-950/20 border border-rose-900 rounded-full flex items-center justify-center text-rose-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-md font-bold text-white">Ingreso Restringido: Logs de Auditoría</h2>
        <p className="text-xs text-zinc-400">Vistas reservadas estrictamente para roles de Gerente o Super Admin. Modifica tu rol en la parte superior derecha para ingresar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Registro de Auditoría</h1>
          <p className="text-xs text-zinc-500">Control de operaciones y trazabilidad de los administradores del gimnasio.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportLogs} className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-xs rounded-xl flex items-center gap-1.5 font-semibold text-zinc-300">
            <HardDriveDownload className="h-3.5 w-3.5" /> Exportar csv
          </button>
          {currentRole === "Super Admin" && (
            <button onClick={clearAuditLogs} className="px-3 py-2 bg-rose-950/20 border border-rose-900/40 text-xs rounded-xl text-rose-400 font-semibold flex items-center gap-1">
              <Trash2 className="h-3.5 w-3.5" /> Limpiar Registro
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#12141c]/50 p-4 border border-zinc-800 rounded-xl flex gap-2">
        {["Todos", "Asistencia", "Socio"].map(cat => (
          <button key={cat} onClick={() => setLogFilter(cat)} className={`px-2.5 py-1 text-xs rounded-md ${logFilter === cat ? "bg-zinc-800 text-white" : "text-zinc-500"}`}>{cat}</button>
        ))}
      </div>

      <div className="bg-[#12141c] border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-900/40 border-b border-zinc-800 text-zinc-500 font-mono">
              <th className="py-2.5 px-5">Timestamp</th>
              <th className="py-2.5 px-4">Acción</th>
              <th className="py-2.5 px-4 text-center">Rol</th>
              <th className="py-2.5 px-5">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850 text-zinc-300 font-sans">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-zinc-900/10">
                <td className="py-3 px-5 font-mono text-zinc-500">{log.timestamp}</td>
                <td className="py-3 px-4 font-semibold text-zinc-200">{log.action}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 border font-mono rounded text-[9px] ${
                    log.role === "Super Admin" ? "bg-rose-950/30 text-rose-400" : "bg-emerald-925/20 text-[#22c55e]"
                  }`}>{log.role}</span>
                </td>
                <td className="py-3 px-5 text-zinc-400">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};