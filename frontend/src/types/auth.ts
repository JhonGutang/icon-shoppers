export interface Login {
    shopName: string;
    password: string;
}

export interface Register {
    shopName: string;
    shopOwner: string;
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
}