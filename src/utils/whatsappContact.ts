export const contactNumberToWhatsapp = (contactNumber: string): string =>
  `https://web.whatsapp.com/send?phone=55${contactNumber.replace(/\D/g, '')}`;
