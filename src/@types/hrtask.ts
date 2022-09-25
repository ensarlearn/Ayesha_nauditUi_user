export type HRTask = {
    id: string;
    name: string;
};

export type HRTaskRequest = {
    id?: string;
    name?: string;
};

export type HRTaskState = {
    loadingStatus: string;
    createStatus: string;
    updateStatus: string;
    deleteStatus: string;
    statusChangeStatus: string;
    error: boolean;
    errorMessage: string | null;
    hrtasks: HRTask[];
    hrtask: HRTask | null;
    sortBy: string | null;
    filters: {
        name: string;
    };
    selectedTasksName: string;
};