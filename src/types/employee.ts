export interface Experience {
    id: string;
    company: string;
    designation: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
}

export interface Education {
    id: string;
    level: string;
    degree: string;
    institution: string;
    passingYear: string;
    grade: string | null;
}

export interface Recruitment {
    id: string;
    examName: string;
    examYear: string;
    rank: string | null;
    orderNumber: string | null;
    orderDate: string | Date | null;
}

export interface Employee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    department: string;
    designation: string;
    status: string;
    dob: string | Date;
    email: string | null;
    zone: string | null;
    fatherName: string | null;
    maritalStatus: string | null;
    bloodGroup: string | null;
    joiningDate: string | Date;
    confirmationDate: string | Date | null;
    payGrade: string | null;
    reportingOfficer: string | null;
    contactNumber: string | null;
    permanentAddress: string | null;
    currentAddress: string | null;
    qr?: { token: string } | null;
    experiences?: Experience[];
    education?: Education[];
    recruitments?: Recruitment[];
}
