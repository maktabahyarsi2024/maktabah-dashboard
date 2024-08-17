import React, { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, ButtonStyle, PATH } from "../../Constants";
import { Form, Select, notification } from "antd";
import Button from "../../Components/ButtonComponent.jsx/Button";
import TextInput from "../../Components/TextInputComponent/TextInput";
import axios from "axios";
import Skeleton from "../../Components/SkeletonComponent/Skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notification";

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
    key: "Update",
    name: "Update",
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

const _renderSelect = (categories, defaultValue) => (
  <Form.Item
    label="Category Parent"
    name="parent"
    initialValue={defaultValue}
    rules={[{ required: true, message: "Category Parent Cannot be Empty" }]}
  >
    <Select
      placeholder="Category Parent"
      name="parent"
      className="w-full"
      showSearch
      filterOption={(input, option) =>
        option.value.toString().toLowerCase().includes(input.toLowerCase()) ||
        option.label.toLowerCase().includes(input.toLowerCase())
      }
      options={_transformCategories(categories)}
    />
  </Form.Item>
);

const _renderTextInput = (defaultValue) => (
  <TextInput
    value={defaultValue}
    label="Category"
    name="title"
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

const UpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentParent, setCurrentParent] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id");
  const categoryTitle = queryParams.get("title");

  const fetchOneCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.CATEGORIES}/${categoryId}`
      );
      if (response.data.length === 0 && typeof response.data === "string") {
        setCurrentParent({ title: "ROOT", _id: "ROOT" });
        return;
      }
      setCurrentParent(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchOneCategory();
  }, []);

  const onFinish = async (form) => {
    const payload = {
      prevTitle: categoryTitle,
      title: form.title,
      parent: form.parent === "ROOT" ? null : form.parent,
      category: categoryId,
    };

    try {
      setLoading(true);
      await axios.put(API_CONFIG.CATEGORIES, payload);
      showSuccessNotification("Success Update Category");
      navigate(PATH.CATEGORY);
    } catch (error) {
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
      {categories.length ? (
        <Form
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ mySelect: undefined }}
        >
          {currentParent && _renderSelect(categories, currentParent._id)}
          {_renderTextInput(categoryTitle)}
          {_renderButton(loading)}
        </Form>
      ) : (
        _renderSkeleton()
      )}
    </ContentLayout>
  );
};

export default UpdateCategory;
