
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.vzguhpifucvhurxndozm:&7BxRH9mKAw*b.W@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function main() {
  console.log('Seeding full demo data...');
  try {
    const adminUser = await prisma.user.findUnique({ where: { username: 'admin' } });
    
    // 1. Employees
    const emp1 = await prisma.employee.upsert({
      where: { employeeCode: 'EMP001' },
      update: {},
      create: {
        firstName: 'John', lastName: 'Doe', employeeCode: 'EMP001',
        designation: 'Senior Supervisor', department: 'Operations',
        status: 'ACTIVE', gender: 'MALE', category: 'GENERAL',
        joiningDate: new Date(), dob: new Date('1985-01-01')
      },
    });

    const emp2 = await prisma.employee.upsert({
      where: { employeeCode: 'EMP002' },
      update: {},
      create: {
        firstName: 'Jane', lastName: 'Smith', employeeCode: 'EMP002',
        designation: 'Health Officer', department: 'Health & Sanitation',
        status: 'ACTIVE', gender: 'FEMALE', category: 'OBC',
        joiningDate: new Date(), dob: new Date('1990-01-01')
      },
    });

    // 2. Reports
    await prisma.report.create({
      data: {
        description: 'New street light request',
        category: 'STREET_LIGHT',
        status: 'PENDING',
        priority: 'MEDIUM',
        department: 'Electricity',
        employeeId: emp1.id
      }
    });

    await prisma.report.create({
      data: {
        description: 'Water pipe leakage',
        category: 'WATER_SUPPLY',
        status: 'RESOLVED',
        priority: 'HIGH',
        department: 'Water Works',
        employeeId: emp2.id
      }
    });

    // 3. Audit Logs
    const now = new Date();
    await prisma.auditLog.createMany({
      data: [
        {
          action: 'CREATE_EMPLOYEE',
          userId: adminUser.id,
          entityId: emp1.id,
          entityType: 'EMPLOYEE',
          details: 'Registered John Doe as Senior Supervisor',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60) // 1 hour ago
        },
        {
          action: 'UPDATE_REPORT',
          userId: adminUser.id,
          entityId: 'some-id',
          entityType: 'REPORT',
          details: 'Resolved water leakage report',
          timestamp: new Date(now.getTime() - 1000 * 60 * 30) // 30 mins ago
        },
        {
          action: 'GENERATE_QR',
          userId: adminUser.id,
          entityId: emp2.id,
          entityType: 'EMPLOYEE',
          details: 'Generated digital ID for Jane Smith',
          timestamp: new Date(now.getTime() - 1000 * 60 * 10) // 10 mins ago
        }
      ]
    });

    console.log('SUCCESS: Full demo data seeded.');
  } catch (err) {
    console.error('SEED ERROR:', err);
  }
}

main().finally(() => prisma.$disconnect());
宣
