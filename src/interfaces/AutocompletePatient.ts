export type AutocompletePatient = {
  id: string;
  name: string;
  CPF?: string;
  contactNumber?: string;
  liable?: {
    name: string;
    contactNumber?: string;
    CPF: string;
  };
};
