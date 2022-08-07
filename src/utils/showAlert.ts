import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';
import { colors } from '@global/colors';

export type AlertProps = {
  icon?: SweetAlertIcon;
  title?: string;
  text: string;
  customClass?: string;
} & SweetAlertOptions;

export const showAlert = ({
  title,
  text,
  icon,
  customClass,
  ...rest
}: AlertProps) =>
  Swal.fire({
    icon: icon || 'info',
    title: title || 'Ops...',
    text,
    confirmButtonColor: colors.PRIMARY,
    customClass: {
      container: customClass,
    },
    ...rest,
  });
