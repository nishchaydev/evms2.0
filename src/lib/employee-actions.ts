'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { verifyJWT } from './auth';
import { logAudit } from './audit-actions';

export async function createEmployee(formData: FormData) {
    try {
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const fatherName = formData.get('fatherName') as string;
        const bloodGroup = formData.get('bloodGroup') as string;
        const maritalStatus = formData.get('maritalStatus') as string;
        const zone = formData.get('zone') as string;

        const dob = formData.get('dob') as string;

        const department = formData.get('department') as string;
        const designation = formData.get('designation') as string;
        const joiningDate = formData.get('joiningDate') as string;
        const confirmationDate = formData.get('confirmationDate') as string;
        const payGrade = formData.get('payGrade') as string;
        const reportingOfficer = formData.get('reportingOfficer') as string;

        const employeeType = formData.get('employeeType') as string;
        const employeeCode = formData.get('employeeCode') as string;

        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;
        const permanentAddress = formData.get('permanentAddress') as string;

        // Basic validation
        if (!firstName || !lastName || !email || !employeeCode) {
            return { success: false, error: 'Missing required fields' };
        }

        // Check if employee ID already exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { employeeCode: employeeCode }
        });

        if (existingEmployee) {
            return { success: false, error: 'Employee ID (Code) already exists' };
        }

        // Generate a placeholder QR token (unique)
        const qrToken = uuidv4();

        // Handle Photo Upload
        const photo = formData.get('photo') as File | null;
        let photoUrl = null;

        if (photo && photo.size > 0 && photo.name !== 'undefined') {
            try {
                const buffer = Buffer.from(await photo.arrayBuffer());
                const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'employees');

                // Ensure directory exists
                await fs.mkdir(uploadDir, { recursive: true });

                const filename = `${employeeCode}-${Date.now()}${path.extname(photo.name)}`;
                const filepath = path.join(uploadDir, filename);

                await fs.writeFile(filepath, buffer);
                // Force forward slashes for URL, even on Windows
                photoUrl = `/uploads/employees/${filename}`;
            } catch (err) {
                console.error("Failed to save photo:", err);
                // Continue without photo or throw error depending on requirements
            }
        }

        // Create Employee with QR
        await prisma.employee.create({
            data: {
                employeeCode,
                firstName,
                lastName,
                email,
                department,
                designation,
                status: 'ACTIVE', // Default to ACTIVE
                contactNumber: phone,
                currentAddress: address, // Mapped to 'address' in schema
                permanentAddress: permanentAddress,
                zone,
                fatherName,
                bloodGroup,
                maritalStatus,
                payGrade,
                reportingOfficer,
                confirmationDate: confirmationDate ? new Date(confirmationDate) : undefined,

                photoUrl: photoUrl, // Save generated URL
                dob: dob ? new Date(dob) : new Date("1990-01-01"),
                joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
                qr: {
                    create: {
                        token: qrToken
                    }
                }
            }
        });

        revalidatePath('/admin/employees');
        await logAudit('CREATE_EMPLOYEE', `Created employee ${firstName} ${lastName} (${employeeCode})`);
        return { success: true };

    } catch (error) {
        console.error('Create Employee Error:', error);
        return { success: false, error: 'Failed to create employee' };
    }
}


export async function getEmployees(
    page: number = 1,
    limit: number = 50,
    filters?: { department?: string, designation?: string }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userDepartment: string | null = null;
        let userRole: string | null = null;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload) {
                userRole = payload.role as string;
                // SUPER_ADMIN and ADMIN see all employees if no department is assigned specifically to them
                if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
                    userDepartment = payload.department as string;
                    // SECURITY FIX: If user is not Admin/Super Admin but has no department, DENY ACCESS.
                    if (!userDepartment) {
                        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
                    }
                } else {
                    // Even for Admins, if they have a department property in JWT, we honor it (optional restriction)
                    userDepartment = (payload.department as string) || null;
                }
            }
        }

        const whereClause: any = userDepartment ? { department: userDepartment } : {};

        // Apply extra filters if provided (mostly for Super Admin)
        if (filters?.department && !userDepartment) {
            // Only allow filtering by department if user is NOT restricted to one (i.e. Super Admin)
            whereClause.department = filters.department;
        }
        if (filters?.designation) {
            whereClause.designation = { contains: filters.designation, mode: 'insensitive' };
        }

        const skip = (page - 1) * limit;

        const [total, employees] = await prisma.$transaction([
            prisma.employee.count({ where: whereClause }),
            prisma.employee.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip: skip,
                take: limit
            })
        ]);

        return {
            data: employees,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('Get Employees Error:', error);
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
}


export async function getEmployeeById(id: string) {
    try {
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                qr: true,
                education: {
                    orderBy: { passingYear: 'desc' }
                },
                experiences: {
                    orderBy: { startDate: 'desc' }
                },
                recruitments: {
                    orderBy: { examYear: 'desc' }
                }
            }
        });
        return employee;
    } catch (error) {
        console.error('Get Employee Error:', error);
        return null;
    }
}

export async function updateEmployee(id: string, formData: FormData) {
    try {
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const fatherName = formData.get('fatherName') as string;
        const bloodGroup = formData.get('bloodGroup') as string;
        const maritalStatus = formData.get('maritalStatus') as string;
        const zone = formData.get('zone') as string;

        const dob = formData.get('dob') as string;
        const department = formData.get('department') as string;
        const designation = formData.get('designation') as string;
        const joiningDate = formData.get('joiningDate') as string;
        const confirmationDate = formData.get('confirmationDate') as string;
        const payGrade = formData.get('payGrade') as string;
        const reportingOfficer = formData.get('reportingOfficer') as string;

        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;
        const permanentAddress = formData.get('permanentAddress') as string;

        await prisma.employee.update({
            where: { id },
            data: {
                firstName,
                lastName,
                fatherName,
                email,
                department,
                designation,
                zone,
                bloodGroup,
                maritalStatus,
                payGrade,
                reportingOfficer,
                contactNumber: phone,
                currentAddress: address,
                permanentAddress,
                dob: dob ? new Date(dob) : undefined,
                joiningDate: joiningDate ? new Date(joiningDate) : undefined,
                confirmationDate: confirmationDate ? new Date(confirmationDate) : undefined,
            }
        });

        revalidatePath('/admin/employees');
        await logAudit('UPDATE_EMPLOYEE', `Updated employee ${firstName} ${lastName} (ID: ${id})`);
        return { success: true };
    } catch (error) {
        console.error('Update Employee Error:', error);
        return { success: false, error: 'Failed to update employee' };
    }
}

export async function addEducation(employeeId: string, formData: FormData) {
    try {
        const level = formData.get('level') as string;
        const degree = formData.get('degree') as string;
        const institution = formData.get('institution') as string;
        const passingYear = formData.get('passingYear') as string;
        const grade = formData.get('grade') as string;

        await prisma.education.create({
            data: {
                employeeId,
                level,
                degree,
                institution,
                passingYear,
                grade
            }
        });

        revalidatePath(`/admin/employees/${employeeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding education:', error);
        return { success: false, error: 'Failed to add education' };
    }
}

export async function addExperience(employeeId: string, formData: FormData) {
    try {
        const company = formData.get('company') as string;
        const designation = formData.get('designation') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const description = formData.get('description') as string;

        await prisma.experience.create({
            data: {
                employeeId,
                company,
                designation,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description
            }
        });

        revalidatePath(`/admin/employees/${employeeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding experience:', error);
        return { success: false, error: 'Failed to add experience' };
    }
}

export async function addRecruitment(employeeId: string, formData: FormData) {
    try {
        const examName = formData.get('examName') as string;
        const examYear = formData.get('examYear') as string;
        const rank = formData.get('rank') as string;
        const orderNumber = formData.get('orderNumber') as string;
        const orderDate = formData.get('orderDate') as string;

        await prisma.recruitment.create({
            data: {
                employeeId,
                examName,
                examYear,
                rank,
                orderNumber,
                orderDate: orderDate ? new Date(orderDate) : null
            }
        });

        revalidatePath(`/admin/employees/${employeeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding recruitment:', error);
        return { success: false, error: 'Failed to add recruitment' };
    }
}

export async function deleteExperience(experienceId: string, employeeId: string) {
    try {
        await prisma.experience.delete({
            where: { id: experienceId }
        });
        revalidatePath(`/admin/employees/${employeeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting experience:', error);
        return { success: false, error: 'Failed to delete experience' };
    }
}

export async function deleteRecruitment(recruitmentId: string, employeeId: string) {
    try {
        await prisma.recruitment.delete({
            where: { id: recruitmentId }
        });
        revalidatePath(`/admin/employees/${employeeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting recruitment:', error);
        return { success: false, error: 'Failed to delete recruitment' };
    }
}

export async function deleteEmployee(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return { success: false, error: 'Unauthorized' };
        }

        const payload = await verifyJWT(token);
        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN')) {
            return { success: false, error: 'Unauthorized: Admin access required' };
        }

        // Before deleting employee, handle the QR code which is 1-1
        await prisma.employeeQR.deleteMany({
            where: { employeeId: id }
        });

        await prisma.employee.delete({
            where: { id }
        });

        revalidatePath('/admin/employees');
        await logAudit('DELETE_EMPLOYEE', `Deleted employee ID: ${id}`);
        return { success: true };
    } catch (error) {
        console.error('Delete Employee Error:', error);
        return { success: false, error: 'Failed to delete employee. Ensure related records are handled.' };
    }
}


export async function searchEmployees(query: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userDepartment: string | null = null;
        let userRole: string | null = null;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload) {
                userRole = payload.role as string;
                if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
                    userDepartment = payload.department as string;
                }
            }
        }

        const where: any = {
            OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { employeeCode: { contains: query, mode: 'insensitive' } },
            ],
        };

        if (userDepartment) {
            where.department = userDepartment;
        }

        const employees = await prisma.employee.findMany({
            where,
            take: 10,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeCode: true,
                designation: true,
                photoUrl: true,
                department: true
            }
        });

        return employees;
    } catch (error) {
        console.error('Search Employees Error:', error);
        return [];
    }
}
