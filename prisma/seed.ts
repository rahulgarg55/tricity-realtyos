import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for Tricity RealtyOS...");

  // Clean existing data in reverse order of foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.whatsAppMessage.deleteMany();
  await prisma.subscriptionInvoice.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.taskFollowUp.deleteMany();
  await prisma.siteVisit.deleteMany();
  await prisma.inventoryStatusHistory.deleteMany();
  await prisma.inventoryUnit.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const passwordHash = await bcrypt.hash("TricityPass123!", 10);

  // 1. Create Platform Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      name: "Tricity Platform Admin",
      email: "superadmin@tricityrealty.com",
      passwordHash,
      role: "SUPER_ADMIN",
      isSuperAdmin: true,
      phone: "+919876543210",
    },
  });
  console.log("✔ Created Platform Super Admin:", superAdmin.email);

  // 2. Create Organization 1: Sushma Urban Developers (Builder Organization)
  const org1 = await prisma.organization.create({
    data: {
      name: "Sushma Urban Developers",
      slug: "sushma-urban",
      phone: "+911724001122",
      address: "Sushma Infinium, Chandigarh-Ambala Highway, Zirakpur",
      city: "Zirakpur",
      state: "Punjab",
      subscriptionTier: "BUSINESS",
      subscriptionStatus: "ACTIVE",
      maxUsers: 50,
      maxLeads: 10000,
      maxProjects: 50,
      whatsappEnabled: true,
    },
  });

  const org1Owner = await prisma.user.create({
    data: {
      name: "Prateek Mittal",
      email: "owner@sushmagroup.com",
      passwordHash,
      role: "OWNER",
      organizationId: org1.id,
      phone: "+919814011111",
    },
  });

  const org1Manager = await prisma.user.create({
    data: {
      name: "Vikramjit Singh",
      email: "manager@sushmagroup.com",
      passwordHash,
      role: "SALES_MANAGER",
      organizationId: org1.id,
      phone: "+919814022222",
    },
  });

  const org1Rep1 = await prisma.user.create({
    data: {
      name: "Rahul Garg",
      email: "rahul.sales@sushmagroup.com",
      passwordHash,
      role: "SALES_REP",
      organizationId: org1.id,
      phone: "+919814033333",
    },
  });

  const org1Rep2 = await prisma.user.create({
    data: {
      name: "Pooja Sharma",
      email: "pooja.sales@sushmagroup.com",
      passwordHash,
      role: "SALES_REP",
      organizationId: org1.id,
      phone: "+919814044444",
    },
  });

  // Projects for Sushma
  const proj1 = await prisma.project.create({
    data: {
      organizationId: org1.id,
      name: "Sushma Grande Zirakpur",
      developer: "Sushma Buildtech Limited",
      location: "PR7 Airport Ring Road",
      city: "Zirakpur",
      projectType: "Residential",
      description: "Premium 3BHK & 4BHK high-rise luxury apartments with Olympic swimming pool and clubhouse.",
      startingPrice: 8500000,
      status: "READY_TO_MOVE",
      reraNumber: "PBRERA-SAS79-PR0088",
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      organizationId: org1.id,
      name: "Sushma Joynest MOH",
      developer: "Sushma Buildtech Limited",
      location: "PR9 Airport Road, Sector 82 Alpha",
      city: "Mohali",
      projectType: "Residential",
      description: "Modern 2BHK and 3BHK residences near Mohali International Airport and IT City.",
      startingPrice: 6200000,
      status: "UNDER_CONSTRUCTION",
      reraNumber: "PBRERA-SAS80-PR0142",
    },
  });

  // Inventory Units for Sushma Grande
  const unit1 = await prisma.inventoryUnit.create({
    data: {
      organizationId: org1.id,
      projectId: proj1.id,
      unitNumber: "Tower A - 402",
      tower: "Tower A",
      floor: 4,
      unitType: "3BHK",
      carpetAreaSqFt: 1450,
      superAreaSqFt: 1850,
      askingPrice: 8850000,
      status: "AVAILABLE",
    },
  });

  const unit2 = await prisma.inventoryUnit.create({
    data: {
      organizationId: org1.id,
      projectId: proj1.id,
      unitNumber: "Tower B - 801",
      tower: "Tower B",
      floor: 8,
      unitType: "4BHK",
      carpetAreaSqFt: 1980,
      superAreaSqFt: 2450,
      askingPrice: 12500000,
      status: "ON_HOLD",
      heldUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24 hours
      heldByUserId: org1Rep1.id,
      bookingAmount: 100000,
      notes: "Client token received; waiting for KYC verification.",
    },
  });

  const unit3 = await prisma.inventoryUnit.create({
    data: {
      organizationId: org1.id,
      projectId: proj1.id,
      unitNumber: "Tower C - 1204",
      tower: "Tower C",
      floor: 12,
      unitType: "3BHK",
      carpetAreaSqFt: 1450,
      superAreaSqFt: 1850,
      askingPrice: 9100000,
      status: "BOOKED",
      bookingAmount: 500000,
    },
  });

  const unit4 = await prisma.inventoryUnit.create({
    data: {
      organizationId: org1.id,
      projectId: proj2.id,
      unitNumber: "Tower M1 - 302",
      tower: "Tower M1",
      floor: 3,
      unitType: "2BHK",
      carpetAreaSqFt: 980,
      superAreaSqFt: 1250,
      askingPrice: 6350000,
      status: "AVAILABLE",
    },
  });

  // Leads for Sushma
  const lead1 = await prisma.lead.create({
    data: {
      organizationId: org1.id,
      name: "Amaninder Singh",
      phone: "+919815012345",
      email: "amaninder.singh@gmail.com",
      preferredLocation: "Zirakpur PR7",
      budgetMin: 8000000,
      budgetMax: 9500000,
      propertyType: "3BHK",
      projectId: proj1.id,
      leadSource: "Meta Ads",
      priority: "HOT",
      stage: "SITE_VISIT_SCHEDULED",
      assignedUserId: org1Rep1.id,
      expectedRevenue: 8850000,
      notes: "NRI buyer visiting Chandigarh next weekend. Interested in park-facing unit.",
      nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      organizationId: org1.id,
      name: "Gurpreet Kaur",
      phone: "+919815023456",
      email: "gurpreet.k@outlook.com",
      preferredLocation: "Mohali Sector 82",
      budgetMin: 6000000,
      budgetMax: 7000000,
      propertyType: "2BHK",
      projectId: proj2.id,
      leadSource: "MagicBricks",
      priority: "HIGH",
      stage: "NEGOTIATION",
      assignedUserId: org1Rep2.id,
      expectedRevenue: 6350000,
      notes: "Senior Software Architect in IT City Mohali. Looking for possession within 6 months.",
      nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      organizationId: org1.id,
      name: "Dr. Rajesh Gupta",
      phone: "+919815034567",
      email: "dr.gupta@fortishealthcare.com",
      preferredLocation: "Zirakpur VIP Road",
      budgetMin: 11000000,
      budgetMax: 13000000,
      propertyType: "4BHK",
      projectId: proj1.id,
      leadSource: "Referral",
      priority: "HOT",
      stage: "BOOKING",
      assignedUserId: org1Rep1.id,
      expectedRevenue: 12500000,
      notes: "Doctor at Fortis Mohali. Booked unit B-801 on hold.",
    },
  });

  // Link lead3 to unit2
  await prisma.inventoryUnit.update({
    where: { id: unit2.id },
    data: { leadId: lead3.id },
  });

  // Site visits for Sushma
  await prisma.siteVisit.create({
    data: {
      organizationId: org1.id,
      leadId: lead1.id,
      projectId: proj1.id,
      inventoryUnitId: unit1.id,
      assignedUserId: org1Rep1.id,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      timeSlot: "11:30 AM - 12:30 PM",
      status: "SCHEDULED",
      location: "Sushma Grande Site Experience Center, PR7",
      notes: "Client requested golf-cart site tour for elderly parents.",
    },
  });

  await prisma.siteVisit.create({
    data: {
      organizationId: org1.id,
      leadId: lead3.id,
      projectId: proj1.id,
      inventoryUnitId: unit2.id,
      assignedUserId: org1Rep1.id,
      scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      timeSlot: "03:00 PM - 04:00 PM",
      status: "COMPLETED",
      outcome: "VERY_INTERESTED",
      clientFeedback: "Loved the balcony view and modular kitchen fittings. Placed token advance.",
    },
  });

  // Follow-up tasks
  await prisma.taskFollowUp.create({
    data: {
      organizationId: org1.id,
      leadId: lead2.id,
      assignedUserId: org1Rep2.id,
      title: "Send updated payment schedule for Joynest MOH 2BHK",
      type: "CALL",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      notes: "Provide 25:75 construction linked plan breakdown.",
    },
  });

  await prisma.taskFollowUp.create({
    data: {
      organizationId: org1.id,
      leadId: lead1.id,
      assignedUserId: org1Rep1.id,
      title: "Call driver to confirm airport pickup for NRI site visit",
      type: "CALL",
      priority: "URGENT",
      dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // Overdue follow-up for testing dashboard alerts!
      isCompleted: false,
      notes: "Pickup from Chandigarh International Airport IXC.",
    },
  });

  // 3. Create Organization 2: Tricity Prime Brokers (Brokerage Organization)
  const org2 = await prisma.organization.create({
    data: {
      name: "Tricity Prime Brokers",
      slug: "tricity-prime",
      phone: "+911722609999",
      address: "SCO 142-143, Sector 34-A",
      city: "Chandigarh",
      state: "Chandigarh",
      subscriptionTier: "GROWTH",
      subscriptionStatus: "ACTIVE",
      maxUsers: 15,
      maxLeads: 2500,
      maxProjects: 10,
    },
  });

  const org2Owner = await prisma.user.create({
    data: {
      name: "Amit Bansal",
      email: "owner@primechd.com",
      passwordHash,
      role: "OWNER",
      organizationId: org2.id,
      phone: "+919888011111",
    },
  });

  const org2Rep = await prisma.user.create({
    data: {
      name: "Neha Verma",
      email: "neha.sales@primechd.com",
      passwordHash,
      role: "SALES_REP",
      organizationId: org2.id,
      phone: "+919888022222",
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      organizationId: org2.id,
      name: "The Palm Mohali",
      developer: "Manohar Infrastructure",
      location: "Sector 82, Mohali",
      city: "Mohali",
      projectType: "Plotted",
      startingPrice: 15000000,
      status: "READY_TO_MOVE",
    },
  });

  const proj4 = await prisma.project.create({
    data: {
      organizationId: org2.id,
      name: "Omaxe The Lake",
      developer: "Omaxe Group",
      location: "Medicity, New Chandigarh",
      city: "New Chandigarh",
      projectType: "Residential",
      startingPrice: 9500000,
      status: "UNDER_CONSTRUCTION",
    },
  });

  await prisma.lead.create({
    data: {
      organizationId: org2.id,
      name: "Col. Harpreet Sodhi",
      phone: "+919888055555",
      email: "harpreet.sodhi@ret.army.in",
      preferredLocation: "New Chandigarh Medicity",
      budgetMin: 9000000,
      budgetMax: 11000000,
      propertyType: "3BHK",
      projectId: proj4.id,
      leadSource: "Broker Network",
      priority: "HIGH",
      stage: "QUALIFIED",
      assignedUserId: org2Rep.id,
      expectedRevenue: 9800000,
      notes: "Retired defense officer looking for peaceful gated township in New Chandigarh.",
    },
  });

  // Invoice records
  await prisma.subscriptionInvoice.create({
    data: {
      organizationId: org1.id,
      amount: 19999,
      plan: "BUSINESS",
      status: "PAID",
      invoiceNumber: "INV-2026-00101",
      paidAt: new Date(),
    },
  });

  await prisma.subscriptionInvoice.create({
    data: {
      organizationId: org2.id,
      amount: 9999,
      plan: "GROWTH",
      status: "PAID",
      invoiceNumber: "INV-2026-00102",
      paidAt: new Date(),
    },
  });

  console.log("✔ Seed completed successfully!");
  console.log("-----------------------------------------------------------------");
  console.log("Super Admin Login: superadmin@tricityrealty.com / TricityPass123!");
  console.log("Builder Owner:     owner@sushmagroup.com        / TricityPass123!");
  console.log("Brokerage Owner:   owner@primechd.com           / TricityPass123!");
  console.log("Sales Rep:         rahul.sales@sushmagroup.com  / TricityPass123!");
  console.log("-----------------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
