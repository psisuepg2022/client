export const contactNumberToWhatsapp = (contactNumber: string): string =>
  `55${contactNumber.replace(/\D/g, '')}`;
