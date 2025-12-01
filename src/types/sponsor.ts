export interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string;
    partnershipInterest: string;
    status: 'Active' | 'Pending' | 'Inactive';
    dateJoined: string;
    contactName?: string;
    email?: string;
    message?: string;
    proposalDocument?: string;
}
