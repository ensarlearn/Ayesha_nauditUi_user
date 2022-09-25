export type HRProject = {
    id: string;
    name: string;
};

export type HRProjectRequest = {
    id?: string;
    name?: string;
};

export type HRProjectState = {
    loadingStatus: string;
    createStatus: string;
    updateStatus: string;
    deleteStatus: string;
    statusChangeStatus: string;
    error: boolean;
    errorMessage: string | null;
    hrprojects: HRProject[];
    hrproject: HRProject | null;
    sortBy: string | null;
    filters: {
        name: string;
    };
    selectedHRProjectName: string;
};
