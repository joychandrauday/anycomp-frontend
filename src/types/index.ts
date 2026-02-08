/* eslint-disable @typescript-eslint/no-explicit-any */
import { Specialist } from "./specialists";


export interface ISecretaryCertification {
    name: string;
    issuing_organization: string;
    issue_date: Date | string;
    expiry_date?: Date | string;
}

export interface ISecretaryContact {
    office_phone?: string;
    mobile_phone?: string;
    office_address?: string;
    emergency_contact?: string;
}
export interface ISecretary {
    email: any;
    full_name: any;
    id: string;
    registration_number: string;
    secretary_type: SecretaryType;
    status: SecretaryStatus;
    registration_date?: Date | string;
    expiry_date?: Date | string;

    // Professional Background
    qualification?: string;
    experience?: string;
    areas_of_expertise?: string[];
    certifications?: ISecretaryCertification[];
    years_of_experience: number;

    // Workload & Performance
    total_companies_managed: number;
    total_specialists_managed: number;
    satisfaction_rate: number;
    is_verified: boolean;

    // Verification Info
    verification_notes?: string;
    verified_at?: Date | string;
    verified_by_id?: string;

    // Rates & Financials
    hourly_rate?: number;
    monthly_rate?: number;

    // Profile Assets
    avatar?: string;
    banner?: string;

    // Availability & Contact
    availability_schedule?: string;
    is_accepting_new_companies: boolean;
    is_accepting_new_specialists: boolean;
    contact_information?: ISecretaryContact;

    // Foreign Keys
    user_id: string;
    manager_id?: string;

    // Relations
    user?: IUser;
    manager?: IUser;
    verified_by?: IUser;
    managed_companies?: any;
    managed_specialists?: Specialist[];

    // Metadata
    created_at: Date | string;
    updated_at: Date | string;
    deleted_at?: Date | string;
}
export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    SPECIALIST = 'specialist',
    SECRETARY = 'secretary',
    CLIENT = 'client',
    VIEWER = 'viewer',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING_VERIFICATION = 'pending_verification',
}

export enum SecretaryStatus {
    ACTIVE = 'active',
    ON_LEAVE = 'on_leave',
    INACTIVE = 'inactive',
}

export enum SecretaryType {
    CORPORATE = 'corporate',
    INDIVIDUAL = 'individual',
}

export interface ContactInformation {
    office_phone?: string;
    mobile_phone?: string;
    office_address?: string;
    emergency_contact?: string;
}

export interface Certification {
    name: string;
    issuing_organization: string;
    issue_date: Date | string;
    expiry_date?: Date | string;
}



export interface IUser {
    id: string;
    email: string;
    full_name: string;
    phone_number?: string;
    address?: string;
    profile_image?: string;
    role: UserRole;
    status: UserStatus;
    department?: string;
    permissions?: string[];
    last_login_at?: Date | string;
    email_verified_at?: Date | string;
    is_profile_complete: boolean;
    is_email_verified: boolean;
    registration_number?: string;

    // Relations
    secretary_profile?: ISecretary;
    manager?: IUser;
    team_members?: IUser[];
    owned_companies?: any[]; // Replace with ICompany
    specialists?: any[];     // Replace with ISpecialist

    created_at: Date | string;
    updated_at: Date | string;
    deleted_at?: Date | string;
}