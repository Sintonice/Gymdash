import React, { useState } from "react";
import { useGym } from "../context/GymContext";
import { Member, PlanType } from "../types";
import { getDaysDifference, getDaysRemaining, CURRENT_DATE_STR, FEE_STRUCTURE } from "../data";
import { Search, UserPlus, Upload, ShieldAlert, Edit2, Trash2, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const MembersView: React.FC = () => {
  const {
    members, currentRole, addMember, editMember, deleteMember, registerAttendance, importMembersFromCSV,
  } = useGym();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [planFilter, setPlanFilter] = useState("Todos");
  const [expiryFilter, setExpiryFilter] = useState("Todos");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Manual Member Form State
  const [newName, setNewName] = useState("");
  const [newPlan, setNewPlan] = useState<PlanType>("mensual");
  const [newLastAttendance, setNewLastAttendance] = useState(CURRENT_DATE_STR);
  const [newExpiryDate, setNewExpiryDate] = useState("2026-07-06");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Edit Forms
  const [editName, setEditName] = useState("");
  const [editPlan, setEditPlan] = useState<PlanType>("mensual");
  const [editLastAttendance, setEditLastAttendance] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [csvInput, setCsvInput] = useState("");
  const [uploadFeedback, setUploadFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const filteredMembers = members.filter((m) => {
    const matchName = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Todos" || m.status === statusFilter;
    const matchPlan = planFilter === "Todos" || m.plan === planFilter;
    const daysLeft = getDaysRemaining(m.expiryDate);
    let matchExpiry = true;
    if (expiryFilter === "Vence 7 dias") matchExpiry = daysLeft >= 0 && daysLeft <= 7;
    else if (expiryFilter === "Vencido") matchExpiry = daysLeft < 0;
    else if (expiryFilter === "Vigente") matchExpiry = daysLeft > 7;

    return matchName && matchStatus && matchPlan && matchExpiry;
  });

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const res = addMember({
      name: newName, plan: newPlan, lastAttendance: newLastAttendance, expiryDate: newExpiryDate,
      email: newEmail, phone: newPhone || "Sin especificar", registerDate: CURRENT_DATE_STR,
    });
    if (res.success) {
      setNewName(""); setNewEmail(""); setNewPhone(""); setIsAddOpen(false);
    }
  };

  const handleOpenEdit = (m: Member) => {
    if (currentRole === "Recepcionista") {
      triggerAccessWarning("Permisos insuficientes para editar socios.");
      return;
    }
    setEditingMemberId(m.id); setEditName(m.name); setEditPlan(m.plan);
    setEditLastAttendance(m.lastAttendance); setEditExpiryDate(m.expiryDate);
    setEditEmail(m.email); setEditPhone(m.phone);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemberId) return;
    const res = editMember(editingMemberId, {
      name: editName, plan: editPlan, lastAttendance: editLastAttendance, expiryDate: editExpiryDate,
      email: editEmail, phone: editPhone,
    });
    if (res.success) setEditingMemberId(null);
  };

  const handleDelete = (id: string) => {
    if (currentRole !== "Super Admin") {
      triggerAccessWarning("Operación Denegada. Solo Super Admin puede eliminar socios.");
      return;
    }
    if (confirm("¿Estás seguro de eliminar permanentemente el registro?")) {
      deleteMember(id);
    }
  };

  const triggerAccessWarning = (msg: string) => {
    setAccessDeniedMessage(msg);
    setTimeout(() => setAccessDeniedMessage(null), 5000);
  };

  const handleProcessCsv = () => {
    if (!csvInput.trim()) return;
    const res = importMembersFromCSV(csvInput);
    if (res.success) {
      setUploadFeedback({ success: true, message: `¡Se agregaron ${res.count} socios con éxito!` });
      setTimeout(() => { setIsImportOpen(false); setUploadFeedback(null); setCsvInput(""); }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Catálogo de Socios</h1>
          <p className="text-xs text-zinc-500">Manejo centralizado de membresías con carga manual y masiva.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsImportOpen(true)} className="px-3 py-2 bg-zinc-800 text-xs font-semibold rounded-xl border border-zinc-700">
            Importar CSV
          </button>
          <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-[#22c55e] text-[#090a0f] font-semibold text-xs rounded-xl">
            Nuevo Socio
          </button>
        </div>
      </div>

      {accessDeniedMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-xl text-xs flex items-center gap-3">
          <ShieldAlert className="h-5 w-5" />
          <span>{accessDeniedMessage}</span>
        </div>
      )}

      {/* Caja de Filtrado */}
      <div className="bg-[#12141c] border border-zinc-800 p-5 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 bg-[#090a0f]/60 border border-zinc-800 focus:outline-none focus:border-[#22c55e] text-xs rounded-xl text-zinc-200"
              placeholder="Buscar socio por ID, nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 bg-[#090a0f]/60 border border-zinc-800 focus:outline-none text-xs rounded-xl text-zinc-300"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="Todos">Planes: Todos</option>
            <option value="mensual">Plan Mensual</option>
            <option value="trimestral">Plan Trimestral</option>
            <option value="anual">Plan Anual</option>
          </select>

          <select
            className="px-3 py-2 bg-[#090a0f]/60 border border-zinc-800 focus:outline-none text-xs rounded-xl text-zinc-300"
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
          >
            <option value="Todos">Vencimiento: Todos</option>
            <option value="Vence 7 dias">Vence en 7 días</option>
            <option value="Vencido">Plan Expirado</option>
            <option value="Vigente">Plan Vigente</option>
          </select>
        </div>

        <div className="flex gap-2 border-t border-zinc-850 pt-3 overflow-x-auto">
          {["Todos", "Activo", "En Riesgo", "Inactivo"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                statusFilter === status ? "bg-[#22c55e]/10 border-[#22c55e]/40 text-[#4ade80]" : "bg-zinc-900 border-zinc-800 text-zinc-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Socios */}
      <div className="bg-[#12141c] border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/40 border-b border-zinc-800 text-zinc-450 text-xs">
                <th className="py-3 px-5">Nombre / ID</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Última Asistencia</th>
                <th className="py-3 px-4">Expiración</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-xs text-zinc-300">
              {filteredMembers.map((member) => {
                const daysSinceLastVisit = getDaysDifference(member.lastAttendance, CURRENT_DATE_STR);
                const daysLeft = getDaysRemaining(member.expiryDate);
                const isEditing = editingMemberId === member.id;

                return (
                  <tr key={member.id} className="hover:bg-zinc-900/20">
                    <td className="py-3.5 px-5">
                      {isEditing ? (
                        <input
                          type="text"
                          className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-xs rounded text-zinc-200"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <div>
                          <p className="font-semibold text-zinc-200">{member.name}</p>
                          <p className="text-[10px] text-zinc-500">ID: {member.id} • {member.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono uppercase">{member.plan}</td>
                    <td className="py-3.5 px-4 font-mono">{member.lastAttendance} <span className="text-[9px] text-zinc-500">({daysSinceLastVisit}d)</span></td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">{member.expiryDate}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        member.status === "Activo" ? "bg-emerald-950/30 text-emerald-300 border-emerald-900/60" :
                        member.status === "En Riesgo" ? "bg-amber-950/30 text-amber-300 border-amber-900/60" : "bg-red-950/30 text-red-300 border-red-900/60"
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {isEditing ? (
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={handleEditSubmit} className="px-2 py-1 bg-emerald-600 text-white rounded font-medium">Guardar</button>
                          <button onClick={() => setEditingMemberId(null)} className="px-2 py-1 bg-zinc-800 rounded">Cancelar</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => registerAttendance(member.id)} className="p-1.5 bg-zinc-800 text-[#4ade80] rounded" title="Check-In">
                            <Play className="h-3 w-3 fill-current" />
                          </button>
                          <button onClick={() => handleOpenEdit(member)} className="p-1.5 bg-zinc-800 text-zinc-300 rounded"><Edit2 className="h-3 w-3" /></button>
                          <button onClick={() => handleDelete(member.id)} className="p-1.5 bg-zinc-800 text-rose-400 rounded"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal De Importación CSV */}
      <AnimatePresence>
        {isImportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#12141c] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="font-semibold text-white font-display">Simulador e Importación CSV</h3>
                <button onClick={() => setIsImportOpen(false)} className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <textarea
                className="w-full p-3 font-mono text-[11px] bg-[#090a0f] border border-zinc-800 rounded-xl text-zinc-300"
                rows={6}
                placeholder="Nombre,Plan,Expiracion,UltimaAsistencia,Email,Telefono&#10;Facundo Alvarez,anual,2027-02-10,2026-06-03,facu@gmail.com,11-5321-4321"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
              />
              {uploadFeedback && <p className="text-xs text-neon-bright">{uploadFeedback.message}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsImportOpen(false)} className="px-3 py-1.5 bg-zinc-800 rounded text-xs">Cerrar</button>
                <button onClick={handleProcessCsv} className="px-3 py-1.5 bg-[#22c55e] text-[#090a0f] rounded text-xs font-bold">Procesar</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-over de alta de socios */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm p-4">
            <form onSubmit={handleAddMemberSubmit} className="bg-[#12141c] border-l border-zinc-800 w-full max-w-md h-full p-6 space-y-4 overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <h3 className="font-semibold text-white">Registrar Socio Nuevo</h3>
                <button type="button" onClick={() => setIsAddOpen(false)}><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">Nombre Completo</label>
                  <input required className="w-full px-3 py-2 bg-[#090a0f] border border-zinc-800 rounded" value={newName} onChange={e => setNewName(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">Email</label>
                  <input required type="email" className="w-full px-3 py-2 bg-[#090a0f] border border-zinc-800 rounded" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">Plan</label>
                  <select className="w-full px-3 py-2 bg-[#090a0f] border border-zinc-800 rounded text-zinc-300" value={newPlan} onChange={e => setNewPlan(e.target.value as PlanType)}>
                    <option value="mensual">Mensual - $18.000</option>
                    <option value="trimestral">Trimestral - $15.000 / mes</option>
                    <option value="anual">Anual - $12.000 / mes</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-500 block font-mono uppercase">Última Asistencia</label>
                    <input type="date" required className="w-full px-2 py-1 bg-[#090a0f] border border-zinc-800 text-xs rounded text-zinc-300" value={newLastAttendance} onChange={e => setNewLastAttendance(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block font-mono uppercase">Vencimiento</label>
                    <input type="date" required className="w-full px-2 py-1 bg-[#090a0f] border border-zinc-800 text-xs rounded text-zinc-300" value={newExpiryDate} onChange={e => setNewExpiryDate(e.target.value)} />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-[#22c55e] text-[#090a0f] font-bold text-xs rounded-xl">Registrar Socio</button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};