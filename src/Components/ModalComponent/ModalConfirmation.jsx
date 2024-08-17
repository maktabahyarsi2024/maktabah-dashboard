import { Modal } from "antd";
import { useState } from "react";

const ModalConfirmation = (props) => {
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        title={props.title}
        open={props.open}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
};

export default ModalConfirmation;
