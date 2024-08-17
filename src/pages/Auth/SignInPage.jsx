import { useEffect, useState } from "react";
import { Form, Input, Card, Alert, Layout, Space, notification } from "antd";
const { Content } = Layout;
import { useNavigate } from "react-router-dom";
import Button from "../../Components/ButtonComponent.jsx/Button";
import { API_CONFIG, PATH } from "../../Constants";
import { postData } from "../../utils/apiConnector";

const SignInForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth");

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    type: "",
    status: false,
  });

  const onFinish = async (form) => {
    setIsLoading(true);
    const response = await postData(API_CONFIG.SIGNIN, form);
    if (response.data?.token) {
      localStorage.setItem("auth", response.data.token);
      localStorage.setItem("role", response.data.role);
      setIsLoading(false);
      navigate("/");
    } else {
      setAlert({
        message: response?.response?.data?.message || "Internal Server Error",
        type: "danger",
        status: true,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <Content
      className="bg-cuk"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical">
        {alert.status && (
          <Alert style={{ width: 400 }} message={alert.message} type="error" />
        )}
        <Card title="Sign In" style={{ width: 400 }}>
          <Form
            layout="vertical"
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              label="email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                className="text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer font-bold min-w-full"
                type="primary"
                disabled={isLoading && true}
                loading={isLoading}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Content>
  );
};

export default SignInForm;
