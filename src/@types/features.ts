export type Features = {
    id: string;
    name: string;
    software: string;
    hostLocation: string;
    owner: string;
    reviewCycle: string;
};

export type FeaturesRequest = {
    id: string;
    name: string;
    software: string;
    hostLocation: string;
    owner: string;
    reviewCycle: string;
};

export type FeaturesState = {
  loadingStatus: string;
  createStatus: string;
  updateStatus: string;
  deleteStatus: string;
  statusChangeStatus: string;
  error: boolean;
  errorMessage: string | null;
  features: Features[];
  feature: Features | null;
  sortBy: string | null;
  filters: {
    name: string;
  };
  selectedFeaturesName: string;
}