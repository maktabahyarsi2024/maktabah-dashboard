import { notification } from "antd";

const showSuccessNotification = (message, description) => {
  notification.success({
    message: message || "Success",
    description: description,
  });
};

const showErrorNotification = (message) => {
  notification.error({
    message,
  });
};

export { showSuccessNotification, showErrorNotification };
