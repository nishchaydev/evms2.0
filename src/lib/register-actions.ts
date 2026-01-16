'use server';

import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function registerEmployeeSelf(formData: FormData) {
    try {
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const fatherName = formData.get('fatherName') as string;
        const bloodGroup = formData.get('bloodGroup') as string;
        const maritalStatus = formData.get('maritalStatus') as string;
        const dob = formData.get('dob') as string;

        const department = formData.get('department') as string;
        const designation = formData.get('designation') as string;
        const joiningDate = formData.get('joiningDate') as string;
        const employeeCode = formData.get('employeeCode') as string;

        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;
        const permanentAddress = formData.get('permanentAddress') as string;

        // Basic validation
        if (!firstName || !lastName || !email || !employeeCode || !department || !designation) {
            return { success: false, error: 'Missing required fields' };
        }

        // Check if employee ID already exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { employeeCode: employeeCode }
        });

        if (existingEmployee) {
            return { success: false, error: 'Employee Code already exists. Please contact admin if this is an error.' };
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

                const filename = `self-${employeeCode}-${Date.now()}${path.extname(photo.name)}`;
                const filepath = path.join(uploadDir, filename);

                await fs.writeFile(filepath, buffer);
                photoUrl = `/uploads/employees/${filename}`;
            } catch (err) {
                console.error("Failed to save photo:", err);
            }
        }

        // Create Employee with PENDING status
        await prisma.employee.create({
            data: {
                employeeCode,
                firstName,
                lastName,
                fatherName,
                email,
                department,
                designation,
                status: 'PENDING', // CRITICAL: Must be PENDING for self-registration
                contactNumber: phone,
                currentAddress: address,
                permanentAddress: permanentAddress,
                bloodGroup,
                maritalStatus,

                photoUrl: photoUrl,
                dob: dob ? new Date(dob) : new Date("1990-01-01"),
                joiningDate: joiningDate ? new Date(joiningDate) : new Date(),

                qr: {
                    create: {
                        token: qrToken
                    }
                }
            }
        });

        // We don't need to revalidate admin paths here necessarily, but good for cache clearing if admin is looking
        revalidatePath('/super-admin/verifications');

        return { success: true };

    } catch (error) {
        console.error('Self Registration Error:', error);
        return { success: false, error: 'Registration failed. Please try again later.' };
    }
}
