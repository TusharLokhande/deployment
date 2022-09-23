import { toast } from "react-toastify";
import "./index.css";

const notify = (type: Number, message: String) => {
  switch (type) {
    case 0:
      return toast.success(message, {
        autoClose: 2500,
      });
    case 1:
      return toast.error(message, {});
    default:
      break;
  }
};

export default notify;
