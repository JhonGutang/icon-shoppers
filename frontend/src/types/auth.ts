export interface Login {
    name: string;
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
    created_at: string
    updated_at: string
    contact_number: string
    description: string
}