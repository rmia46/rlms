import { useToastStore } from '../store/useToastStore';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const Toast = () => {
  const { message, type, show, hideToast } = useToastStore();

  if (!show || !message) {
    return null;
  }

  let icon = null;
  let alertClass = '';

  switch (type) {
    case 'success':
      icon = <CheckCircle className="w-6 h-6" />;
      alertClass = 'alert-success';
      break;
    case 'error':
      icon = <XCircle className="w-6 h-6" />;
      alertClass = 'alert-error';
      break;
    case 'info':
      icon = <Info className="w-6 h-6" />;
      alertClass = 'alert-info';
      break;
    default:
      return null;
  }

  return (
    <div className="toast toast-end z-50 transition-all ease-in-out duration-500 transform translate-y-0 opacity-100">
      <div className={`alert ${alertClass} flex items-center shadow-lg transition-all duration-300`}>
        {icon}
        <span>{message}</span>
        <button className="btn btn-ghost btn-sm" onClick={hideToast}>
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;