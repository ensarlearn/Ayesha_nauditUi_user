export type LinkedinLead = {
    id: string;
    websiteLink: string;
    disabled?: boolean;
};

export type LinkedinLeadRequest = {
    id?: string;
    websiteLink?: string;
};

export type LinkedinLeadState = {
    loadingStatus: string;
    createStatus: string;
    updateStatus: string;
    deleteStatus: string;
    statusChangeStatus: string;
    error: boolean;
    errorMessage: string | null;
    linkedinLeads: LinkedinLead[];
    linkedinLead: LinkedinLead | null;
    sortBy: string | null;
    filters: {
        websiteLink: string;
    };
    selectedLinkedinLeadsName: string;
};