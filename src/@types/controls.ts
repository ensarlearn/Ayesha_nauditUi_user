export type Controls = {
    id: string;
    name: string;
    subcategory: string;
};

export type ControlsRequest = {
    id: string;
    name: string;
    subcategory: string;
};

export type ControlsState = {
    loadingStatus: string;
    createStatus: string;
    updateStatus: string;
    deleteStatus: string;
    statusChangeStatus: string;
    error: boolean;
    errorMessage: string | null;
    controls: Controls[];
    control: Controls | null;
    sortBy: string | null;
    filters: {
        name: string;
    };
    selectedControlsName: string;
};