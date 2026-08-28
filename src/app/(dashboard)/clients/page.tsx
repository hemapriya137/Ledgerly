"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  Trash2,
  Edit2,
  Sparkles,
  Zap,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Card3D from "@/components/ui/Card3D";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { formatCurrency } from "@/lib/utils";

interface ClientData {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  notes?: string;
  invoices?: Array<{ id: string; totalAmount: number; status: string }>;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [count, setCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  async function fetchClients() {
    try {
      const res = await fetch(`/api/clients?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
        setCount(data.count || 0);
        setIsPro(data.isPro || false);
        setIsLimitReached(data.isLimitReached || false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    if (!isPro && count >= 5) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setFormData({ name: "", email: "", company: "", phone: "", address: "", notes: "" });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (client: ClientData) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company || "",
      phone: client.phone || "",
      address: client.address || "",
      notes: client.notes || "",
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Client name and email are required.");
      return;
    }

    try {
      const url = isEditModalOpen && currentClient ? `/api/clients/${currentClient.id}` : "/api/clients";
      const method = isEditModalOpen ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.code === "LIMIT_REACHED") {
          setIsAddModalOpen(false);
          setIsUpgradeModalOpen(true);
          return;
        }
        setFormError(json.error || "Failed to save client.");
        return;
      }

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      fetchClients();
    } catch (e: any) {
      setFormError(e.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove client "${name}"? Associated invoices will also be removed.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchClients();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <DashboardHeader
        title="Client Portfolio"
        subtitle="Manage your client relationships, contracts, and contact profiles."
      />

      <main className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Add Client CTA with Tier Limit Notice */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 font-medium px-3 py-1.5 rounded-lg bg-[#061812] border border-emerald-500/20">
              {isPro ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Unlimited Pro Clients
                </span>
              ) : (
                <span>
                  {count} / 5 Free Client Slots Used
                </span>
              )}
            </div>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-emerald-glow text-xs font-bold whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Client</span>
            </button>
          </div>
        </div>

        {/* Free Tier Limit Alert */}
        {!isPro && count >= 5 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Client Limit Reached (5/5)</h4>
                <p className="text-[11px] text-slate-300">
                  Free accounts can manage up to 5 clients. Upgrade to Pro for unlimited client relationships and custom branding.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl btn-gold-glow text-xs font-bold whitespace-nowrap flex items-center gap-1"
            >
              <Zap className="w-3 h-3 fill-current" /> Upgrade Now
            </button>
          </div>
        )}

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const invoices = client.invoices || [];
            const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
            const paidCount = invoices.filter((i) => i.status === "PAID").length;

            return (
              <Card3D key={client.id} depth={8} glowColor="emerald">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-teal-400/20 border border-emerald-500/40 flex items-center justify-center font-display font-extrabold text-lg text-white">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-white">{client.name}</h3>
                      {client.company && (
                        <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                          <Building className="w-3 h-3" /> {client.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(client)}
                      title="Edit Client"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
                      title="Delete Client"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                {/* Billing Summary Box */}
                <div className="p-3 rounded-xl bg-[#040d0a]/60 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Total Invoiced</span>
                    <div className="font-bold text-white">{formatCurrency(totalInvoiced)}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Invoices</span>
                    <div className="font-bold text-emerald-400">
                      {paidCount}/{invoices.length} Paid
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                  <a
                    href={`/invoices/new?clientId=${client.id}`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Invoice
                  </a>
                </div>
              </Card3D>
            );
          })}

          {clients.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">No Clients Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery ? "No clients matched your search query." : "Add your first client to start creating branded invoices."}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl btn-emerald-glow text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add First Client
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Client Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-[#061812] border border-emerald-500/30 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-lg text-white">
              {isEditModalOpen ? "Edit Client Profile" : "Add New Client"}
            </h3>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="sophia@nexusdynamics.tech"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="Nexus Dynamics"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Billing Address</label>
                <input
                  type="text"
                  placeholder="500 Howard St, San Francisco, CA"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Terms</label>
                <textarea
                  rows={2}
                  placeholder="Payment milestones, special terms..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl btn-emerald-glow font-bold">
                  {isEditModalOpen ? "Save Changes" : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccess={() => {
          setIsUpgradeModalOpen(false);
          fetchClients();
        }}
      />
    </div>
  );
}
