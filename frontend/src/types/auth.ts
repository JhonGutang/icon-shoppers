export interface Login {
    email: string;
    password: string;
}

export interface Register {
    name: string;
    middleName?: string;
    shopOwner?: string;
    email: string;
    address?: string,
    contactNumber: string;
    password: string;
}

export interface Profile {
    name: string
    email: string
    id: number
    owner: string
    created_at?: string
    updated_at?: string
    contact_number: string
    logo_image: string
    description: string
}

export interface CustomerProfile {
    name: string
    email: string
    id: number
    created_at: string
    updated_at: string
    contact_number: string
    logo_image?: string
    address: string
    description: string
    middle_name?: string
}
export interface SellerProfile {
    name: string
    email: string
    id: number
    created_at: string
    updated_at: string
    contact_number: string
    logo_image?: string
    address: string
    description: string
    owner: string
}

export interface ProfileDisplay {
    id?: number
    owner?: string;
    email: string;
    address?: string,
    profileImage?: string,
    contactNumber?: string;
    name: string
    description?: string
}

export interface EditProfile {
    name: string;
    middleName?: string;
    shopOwner?: string;
    email: string;
    address?: string,
    contactNumber?: string;
}