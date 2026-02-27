const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres.vzguhpifucvhurxndozm:&7BxRH9mKAw*b.W@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
        }
    }
});

const team1 = ["Nishchay", "Pratibha", "Vishal", "Nikhil", "Pratyaksh", "Shreyansh"];
const team2 = ["Sachin", "Mohit", "Nayan", "Vishal"];

const { v4: uuidv4 } = require('uuid');

async function main() {
    console.log('Seeding dummy employees...');
    try {
        let codeCounter = 1000;

        for (const name of team1) {
            await prisma.employee.create({
                data: {
                    employeeCode: `EMP${codeCounter++}`,
                    firstName: name,
                    lastName: "T1",
                    department: "Engineering",
                    designation: "Developer",
                    status: "ACTIVE",
                    joiningDate: new Date(),
                    qr: {
                        create: {
                            token: uuidv4()
                        }
                    }
                }
            });
        }

        for (const name of team2) {
            await prisma.employee.create({
                data: {
                    employeeCode: `EMP${codeCounter++}`,
                    firstName: name,
                    lastName: "T2",
                    department: "Engineering",
                    designation: "Developer",
                    status: "ACTIVE",
                    joiningDate: new Date(),
                    qr: {
                        create: {
                            token: uuidv4()
                        }
                    }
                }
            });
        }

        console.log('SUCCESS: Dummy employees created.');
    } catch (err) {
        console.error('SEED ERROR:', err);
    }
}

main().finally(() => prisma.$disconnect());
