export type HRTask = {
    id: string;
    name: string;
    disabled?: boolean;
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
    hrTasks: HRTask[];
    hrTask: HRTask | null;
    sortBy: string | null;
    filters: {
        name: string;
    };
    selectedHRTasksName: string;
};