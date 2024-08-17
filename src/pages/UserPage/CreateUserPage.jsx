import React, { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, ButtonStyle, PATH } from "../../Constants";
import { Form, Select, notification, Input } from "antd";
import Button from "../../Components/ButtonComponent.jsx/Button";
import TextInput from "../../Components/TextInputComponent/TextInput";
import axios from "axios";
import Skeleton from "../../Components/SkeletonComponent/Skeleton";
import { useNavigate } from "react-router-dom";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notification";
import handleError from "../../utils/handleError";

const _breadcrumbItems = () => [
  {
    key: "Dashboard",
    href: PATH.DASHBOARD,
    name: "Dashboard",
  },
  {
    key: "Users",
    href: PATH.USER,
    name: "Users",
  },
  {
    key: "Create",
    name: "Create",
  },
];

const _transformCategories = (categories) => {
  const newCategories = categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));
  const noParentCategories = {
    value: "ROOT",
    label: "ROOT",
  };
  return [noParentCategories, ...newCategories];
};

const _renderTextInputUsername = () => (
  <TextInput
    label="Username"
    name="username"
    placeholder="Username"
    required={true}
    message="Username Cannot be Empty"
    type="text"
  />
);

const _renderTextInputPassword = () => (
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
    <Input.Password placeholder="Password" autoComplete="new-password" />
  </Form.Item>
);

const _renderTextInputEmail = () => (
  <TextInput
    label="Email"
    name="email"
    placeholder="Email"
    required={true}
    message="Email Cannot be Empty"
  />
);

const _renderSelect = () => (
  <Form.Item
    label="Role"
    name="role"
    rules={[{ required: true, message: "Role Cannot be Empty" }]}
  >
    <Select
      placeholder="Role User"
      name="role"
      className="w-full"
      showSearch
      options={[
        { value: "admin", label: <span>Admin</span> },
        { value: "super admin", label: <span>Super Admin</span> },
      ]}
    />
  </Form.Item>
);

const _renderButton = (loading) => (
  <Form.Item>
    <Button
      loading={loading}
      disabled={loading}
      className={ButtonStyle.SAVE}
      type="submit"
    >
      Save
    </Button>
  </Form.Item>
);

const _renderSkeleton = () => (
  <>
    <Skeleton className="mb-2" />
    <Skeleton className="mb-2" />
    <Skeleton className="w-40" />
  </>
);

const CreateUser = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createUserHandler = async (form) => {
    try {
      setLoading(true);
      await axios.post(`${API_CONFIG.SIGN_UP}`, form);
      showSuccessNotification("Success Create New User");
      navigate(PATH.USER);
    } catch (error) {
      handleError(error);
      showErrorNotification("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (form) => {
    console.log({ ...form, confPassword: form.password });
    await createUserHandler({ ...form, confPassword: form.password });
  };

  return (
    <ContentLayout breadCrumbs={_breadcrumbItems()}>
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ mySelect: undefined }}
      >
        {_renderTextInputUsername()}
        {_renderTextInputEmail()}
        {_renderSelect()}
        {_renderTextInputPassword()}
        {_renderButton(loading)}
      </Form>
    </ContentLayout>
  );
};

export default CreateUser;
