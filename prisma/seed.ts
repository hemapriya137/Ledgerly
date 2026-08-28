import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Free Tier Demo User (Alex Rivera)
  const freeUser = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "alex@ledgerly.io",
      password: hashedPassword,
      isPro: false,
      companyName: "Rivera Creative Labs",
      companyEmail: "hello@riveracreative.design",
      companyAddress: "742 Evergreen Terrace, Brooklyn, NY 11201",
      companyPhone: "+1 (555) 234-5678",
      currency: "USD",
      taxNumber: "US-987654321",
    },
  });

  // 2. Create Pro Tier Demo User (Elena Vance)
  const proUser = await prisma.user.create({
    data: {
      name: "Elena Vance",
      email: "elena@ledgerly.io",
      password: hashedPassword,
      isPro: true,
      stripeCustomerId: "cus_mock_pro_elena_12345",
      stripeSubscriptionId: "sub_mock_pro_active_98765",
      companyName: "Vance Spatial & 3D Studio",
      companyEmail: "billing@vancestudio.design",
      companyAddress: "100 5th Avenue, Suite 1400, New York, NY 10011",
      companyPhone: "+1 (555) 890-1234",
      currency: "USD",
      taxNumber: "US-112233445",
    },
  });

  console.log("👤 Created demo users: alex@ledgerly.io (Free) & elena@ledgerly.io (Pro)");

  // 3. Create Clients for Alex (Free User: 4 clients out of 5 allowed)
  const c1 = await prisma.client.create({
    data: {
      userId: freeUser.id,
      name: "Sophia Chen",
      email: "sophia@nexusdynamics.tech",
      company: "Nexus Dynamics",
      phone: "+1 (415) 800-1122",
      address: "500 Howard St, San Francisco, CA 94105",
      notes: "Bi-weekly design sprints for web platform.",
    },
  });

  const c2 = await prisma.client.create({
    data: {
      userId: freeUser.id,
      name: "Marcus Vance",
      email: "marcus@aurorafinance.co",
      company: "Aurora Capital",
      phone: "+1 (212) 555-4321",
      address: "350 Park Ave, New York, NY 10022",
      notes: "Fintech brand identity and design system.",
    },
  });

  const c3 = await prisma.client.create({
    data: {
      userId: freeUser.id,
      name: "Liam O'Connor",
      email: "liam@pulsecreative.agency",
      company: "Pulse Media Agency",
      phone: "+1 (312) 777-8899",
      address: "200 E Randolph St, Chicago, IL 60601",
      notes: "Ongoing retainer for motion graphics.",
    },
  });

  const c4 = await prisma.client.create({
    data: {
      userId: freeUser.id,
      name: "Maya Patel",
      email: "maya@solislabs.io",
      company: "Solis AI Health",
      phone: "+1 (617) 444-3322",
      address: "100 Tech Square, Cambridge, MA 02139",
      notes: "Product UI/UX design and tokenomics deck.",
    },
  });

  // 4. Create Invoices for Alex (Free User)
  // Paid Invoice
  const now = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
  const inTenDays = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const pastDueDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-001",
      userId: freeUser.id,
      clientId: c1.id,
      status: "PAID",
      issueDate: thirtyDaysAgo,
      dueDate: fifteenDaysAgo,
      paidAt: fifteenDaysAgo,
      currency: "USD",
      taxRate: 8.5,
      discount: 0,
      subtotal: 4500,
      taxAmount: 382.5,
      discountAmount: 0,
      totalAmount: 4882.5,
      notes: "Thanks for partnering with Rivera Creative Labs!",
      viewToken: "tok_inv_001_nexus_paid",
      items: {
        create: [
          { description: "Design System Tokens & Component Library", quantity: 1, unitPrice: 3000, amount: 3000 },
          { description: "Interactive Prototype & Motion Specs", quantity: 15, unitPrice: 100, amount: 1500 },
        ],
      },
    },
  });

  // Sent / Pending Invoice
  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-002",
      userId: freeUser.id,
      clientId: c2.id,
      status: "SENT",
      issueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      dueDate: inTenDays,
      currency: "USD",
      taxRate: 0,
      discount: 5,
      subtotal: 6200,
      taxAmount: 0,
      discountAmount: 310,
      totalAmount: 5890,
      notes: "Includes 5% early bird client discount.",
      viewToken: "tok_inv_002_aurora_sent",
      items: {
        create: [
          { description: "Brand Identity Discovery & Guidelines Book", quantity: 1, unitPrice: 3800, amount: 3800 },
          { description: "Pitch Deck Master Template & 3D Icons", quantity: 1, unitPrice: 2400, amount: 2400 },
        ],
      },
    },
  });

  // Overdue Invoice
  const inv3 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-003",
      userId: freeUser.id,
      clientId: c3.id,
      status: "OVERDUE",
      issueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      dueDate: pastDueDaysAgo,
      currency: "USD",
      taxRate: 10,
      discount: 0,
      subtotal: 2800,
      taxAmount: 280,
      discountAmount: 0,
      totalAmount: 3080,
      notes: "Payment was due on " + pastDueDaysAgo.toLocaleDateString() + ". Please remit at your earliest convenience.",
      viewToken: "tok_inv_003_pulse_overdue",
      items: {
        create: [
          { description: "3D Product Animation (15-sec reel)", quantity: 2, unitPrice: 1400, amount: 2800 },
        ],
      },
    },
  });

  // Draft Invoice
  const inv4 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-004",
      userId: freeUser.id,
      clientId: c4.id,
      status: "DRAFT",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      currency: "USD",
      taxRate: 5,
      discount: 0,
      subtotal: 3500,
      taxAmount: 175,
      discountAmount: 0,
      totalAmount: 3675,
      notes: "Work in progress draft for Solis AI UI kit.",
      viewToken: "tok_inv_004_solis_draft",
      items: {
        create: [
          { description: "AI Dashboard Mobile & Desktop Wireframes", quantity: 1, unitPrice: 2000, amount: 2000 },
          { description: "Figma Interactive Variables Setup", quantity: 15, unitPrice: 100, amount: 1500 },
        ],
      },
    },
  });

  // 5. Create Expenses for Alex
  const expenses = [
    {
      userId: freeUser.id,
      title: "Figma Organization Annual Seat",
      description: "Design workspace collaboration",
      amount: 540.0,
      category: "Software",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      isBillable: false,
    },
    {
      userId: freeUser.id,
      title: "Spline 3D Pro Subscription",
      description: "Interactive 3D asset generation",
      amount: 144.0,
      category: "Software",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      isBillable: true,
      clientName: "Nexus Dynamics",
    },
    {
      userId: freeUser.id,
      title: "CalDigit TS4 Thunderbolt Dock",
      description: "Dual 4K studio monitor workstation",
      amount: 399.99,
      category: "Hardware",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      isBillable: false,
    },
    {
      userId: freeUser.id,
      title: "Flight & Accommodation - AIGA Design Con",
      description: "Client networking and design workshop",
      amount: 820.5,
      category: "Travel",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      isBillable: false,
    },
    {
      userId: freeUser.id,
      title: "Freelance 3D Shading Assistant",
      description: "Subcontractor for Aurora pitch renders",
      amount: 950.0,
      category: "Contractor",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      isBillable: true,
      clientName: "Aurora Capital",
    },
  ];

  for (const exp of expenses) {
    await prisma.expense.create({ data: exp });
  }

  // 6. Create Clients & Invoices for Pro User Elena
  const proClient1 = await prisma.client.create({
    data: {
      userId: proUser.id,
      name: "Gillian Frost",
      email: "gillian@cybervault.io",
      company: "CyberVault Technologies",
      phone: "+1 (415) 999-0000",
      address: "101 California St, San Francisco, CA",
      notes: "Enterprise 3D spatial UI development.",
    },
  });

  const proClient2 = await prisma.client.create({
    data: {
      userId: proUser.id,
      name: "Tariq Mansoor",
      email: "tariq@astralux.de",
      company: "Astralux Mobility Berlin",
      phone: "+49 30 123456",
      address: "Friedrichstraße 40, 10117 Berlin, Germany",
      notes: "Electric vehicle dashboard 3D digital twin.",
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-VANCE-901",
      userId: proUser.id,
      clientId: proClient1.id,
      status: "PAID",
      issueDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      currency: "USD",
      taxRate: 0,
      discount: 0,
      subtotal: 12500,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 12500,
      notes: "Enterprise Spatial UI Retainer (Phase 1)",
      viewToken: "tok_inv_vance_901_paid",
      items: {
        create: [
          { description: "Spatial UI Vision Design & Shaders", quantity: 1, unitPrice: 7500, amount: 7500 },
          { description: "Interactive WebGL Engine Integration", quantity: 1, unitPrice: 5000, amount: 5000 },
        ],
      },
    },
  });

  console.log("✅ Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
