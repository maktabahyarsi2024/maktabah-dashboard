import React, { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, ButtonStyle, PATH } from "../../Constants";
import { Form, Select, notification } from "antd";
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
    key: "Category",
    href: PATH.CATEGORY,
    name: "Category",
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

const _renderSelect = (categories) => (
  <Form.Item
    label="Category Parent"
    name="parent"
    rules={[{ required: true, message: "Category Parent Cannot be Empty" }]}
  >
    <Select
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      placeholder="Category Parent"
      name="parent"
      className="w-full"
      showSearch
      options={_transformCategories(categories)}
    />
  </Form.Item>
);

const _renderTextInput = () => (
  <TextInput
    label="Category"
    name="category"
    placeholder="Category"
    required={true}
    message="Category Cannot be Empty"
  />
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

const CreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_CONFIG.CATEGORIES);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onFinish = async (form) => {
    const payload = {
      title: form.category,
      parent: form.parent === "ROOT" ? null : form.parent,
    };
    console.log("payload", payload);

    try {
      setLoading(true);
      await axios.post(API_CONFIG.CATEGORY, payload);
      showSuccessNotification("Success Adding New Category");
      navigate(PATH.CATEGORY);
    } catch (error) {
      handleError(error)
      if (error.response.status === 409) {
        showErrorNotification("Category Already Exist!");
        return;
      }
      showErrorNotification("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ContentLayout breadCrumbs={_breadcrumbItems()}>
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ mySelect: undefined }}
      >
        {_renderSelect(categories)}
        {_renderTextInput()}
        {_renderButton(loading)}
      </Form>
    </ContentLayout>
  );
};

export default CreateCategory;
