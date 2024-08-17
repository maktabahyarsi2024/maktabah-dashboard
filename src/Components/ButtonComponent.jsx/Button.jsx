import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Props from "prop-types";

const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      className={`cursor-pointer w-40 p-2 rounded-md ${props.className}`}
      type={props.type}
      onClick={props.onClick}
    >
      {props.loading && (
        <Spin indicator={<LoadingOutlined style={{ color: "white" }} />} />
      )}{" "}
      {props.children}
    </button>
  );
};

Button.propTypes = {
  className: Props.string,
  type: Props.string,
  children: Props.node,
  onClick: Props.func,
  disabled: Props.bool,
  loading: Props.bool
};

export default Button;
