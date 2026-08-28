"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import AmbientCanvas3D from "@/components/3d/AmbientCanvas3D";
import UpgradeModal from "@/components/ui/UpgradeModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#040d0a] text-[#f3f4f6] relative selection:bg-emerald-500 selection:text-black">
      {/* Background 3D Ambient Low-Poly Elements */}
      <AmbientCanvas3D />

      {/* Sidebar Navigation */}
      <DashboardSidebar onUpgradeClick={() => setIsUpgradeModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {children}
      </div>

      {/* Pro Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccess={() => {
          setIsUpgradeModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
