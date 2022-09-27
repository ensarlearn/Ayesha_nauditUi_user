export type Role = {
    id: string;
    name: string;
    disabled?: boolean;
};

export type RoleRequest = {
    id?: string;
    name?: string;
};

export type RoleState = {
    loadingStatus: string;
    createStatus: string;
    updateStatus: string;
    deleteStatus: string;
    statusChangeStatus: string;
    error: boolean;
    errorMessage: string | null;
    roles: Role[];
    role: Role | null;
    sortBy: string | null;
    filters: {
        name: string;
    };
    selectedRolesName: string;
};