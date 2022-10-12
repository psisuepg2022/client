import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';
import './custom.css';

export type AlertProps = {
  icon?: SweetAlertIcon;
  text: string;
  // customClass?: string;
} & SweetAlertOptions;

export const showToast = ({
  text,
  icon,
  // customClass,
  ...rest
}: AlertProps) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-left',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    showCloseButton: true,
    customClass: {
      timerProgressBar: 'my-progress-bar',
    },
  });

  return Toast.fire({
    icon: icon || 'success',
    title: text,
    ...rest,
  });
};
