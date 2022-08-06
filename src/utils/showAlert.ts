import Swal, { SweetAlertIcon } from 'sweetalert2';
import { colors } from '../global/colors';

export interface AlertProps {
  icon?: SweetAlertIcon;
  title?: string;
  text: string;
  customClass?: string;
}

export const showAlert = ({ title, text, icon, customClass }: AlertProps) =>
  Swal.fire({
    icon: icon || 'info',
    title: 'Ops...' || title,
    text,
    confirmButtonColor: colors.PRIMARY,
    customClass: {
      container: customClass,
    },
  });
