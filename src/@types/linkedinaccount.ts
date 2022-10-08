export type LinkedinAccount = {
    id: string;
    email: string;
    disabled?: boolean;
};

export type LinkedinAccountRequest = {
    id?: string;
    email?: string;
};

export type LinkedinAccountState = {
    loadingStatus: string;
    createStatus: string;
    updateStatus: string;
    deleteStatus: string;
    statusChangeStatus: string;
    error: boolean;
    errorMessage: string | null;
    linkedinAccounts: LinkedinAccount[];
    linkedinAccount: LinkedinAccount | null;
    sortBy: string | null;
    filters: {
        email: string;
    };
    selectedLinkedinAccountsName: string;
};