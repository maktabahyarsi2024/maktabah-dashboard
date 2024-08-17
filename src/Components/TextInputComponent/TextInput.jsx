import Props from "prop-types";
import { Form, Input } from "antd";

const TextInput = (props) => {
  return (
    <Form.Item
      name={props.name}
      label={props.label}
      rules={[{ required: props.required, message: props.message }]}
      initialValue={props.value}
    >
      <Input placeholder={props.placeholder} type={props.type} />
    </Form.Item>
  );
};

TextInput.propTypes = {
  name: Props.string.isRequired,
  type: Props.string,
  label: Props.string.isRequired,
  required: Props.bool,
  message: Props.string,
  placeholder: Props.string,
  value: Props.string,
};


export default TextInput;
