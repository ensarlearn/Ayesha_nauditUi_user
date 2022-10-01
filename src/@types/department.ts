export type Department = {
    id: string;
    name: string;
    disabled?: boolean;
};

export type DepartmentRequest = {
    id?: string;
    name?: string;
};

export type DepartmentState = {
    loadingStatus: string;
    createStatus: string;
    updateStatus: string;
    deleteStatus: string;
    statusChangeStatus: string;
    error: boolean;
    errorMessage: string | null;
    departments: Department[];
    department: Department | null;
    sortBy: string | null;
    filters: {
        name: string;
    };
    selectedDepartmentsName: string;
};