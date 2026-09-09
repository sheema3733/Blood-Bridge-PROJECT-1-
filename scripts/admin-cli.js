#!/usr/bin/env node

/**
 * BloodBridge Administrative Command-Line Tool
 * Provides operations team with CLI control for emergency overrides,
 * user verification status inspection, and live inventory diagnostics.
 */

const { PrismaClient } = require('../server/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../server/prisma/dev.db',
    },
  },
});

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  console.log(`\n======================================================`);
  console.log(`  🩸 BloodBridge Ops Command-Line Management Tool`);
  console.log(`======================================================\n`);

  switch (command) {
    case 'users:list': {
      const users = await prisma.user.findMany({
        take: 20,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
      console.log(`Found ${users.length} registered accounts:\n`);
      console.table(users);
      break;
    }

    case 'requests:summary': {
      const counts = await prisma.bloodRequest.groupBy({
        by: ['status'],
        _count: { id: true },
      });
      console.log('Active Blood Coordination Request Breakdown:\n');
      console.table(counts.map((c) => ({ status: c.status, count: c._count.id })));
      break;
    }

    case 'hospitals:verified': {
      const hospitals = await prisma.hospitalProfile.findMany({
        where: { isVerified: true },
        select: { id: true, hospitalName: true, address: true, city: true, phone: true },
      });
      console.log(`Verified Healthcare Institutions (${hospitals.length}):\n`);
      console.table(hospitals);
      break;
    }

    case 'help':
    default: {
      console.log(`Available Commands:
  node scripts/admin-cli.js users:list          List recent user accounts
  node scripts/admin-cli.js requests:summary    Display emergency requests breakdown by status
  node scripts/admin-cli.js hospitals:verified  List verified partner hospitals
  node scripts/admin-cli.js help                Show this manual
`);
      break;
    }
  }
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error('CLI execution error:', err.message);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { main };
