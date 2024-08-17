import React, { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, ButtonStyle, PATH } from "../../Constants";
import {
  Form,
  Select,
  notification,
  Input,
  Upload,
  Button as AntdButton,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Button from "../../Components/ButtonComponent.jsx/Button";
import TextInput from "../../Components/TextInputComponent/TextInput";
import axios from "axios";
import Skeleton from "../../Components/SkeletonComponent/Skeleton";
import { useNavigate } from "react-router-dom";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notification";

const { TextArea } = Input;

const _breadcrumbItems = () => [
  {
    key: "Dashboard",
    href: PATH.DASHBOARD,
    name: "Dashboard",
  },
  {
    key: "Bibliography",
    href: PATH.BIBLIOGRAPHY,
    name: "Bibliography",
  },
  {
    key: "Create",
    name: "Create",
  },
];

const _transformCategories = (categories) => {
  return categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));
};

const _renderSelect = (categories) => (
  <Form.Item
    label="Category"
    name="category"
    rules={[{ required: true, message: "Category Cannot be Empty" }]}
  >
    <Select
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      placeholder="Category"
      name="category"
      className="w-full"
      showSearch
      options={_transformCategories(categories)}
    />
  </Form.Item>
);

const _renderInputTitle = () => (
  <TextInput
    label="Title"
    name="title"
    placeholder="Title"
    required={true}
    message="Title Cannot be Empty"
  />
);

const _renderUploadImage = () => (
  <Form.Item
    label="Image"
    name="image"
    valuePropName="fileList"
    getValueFromEvent={(e) => e && e.fileList}
  >
    <Upload
      name="image"
      listType="picture"
      beforeUpload={() => false}
      maxCount={1}
    >
      <AntdButton icon={<UploadOutlined />}>Upload</AntdButton>
    </Upload>
  </Form.Item>
);

const _renderInputContributor = () => (
  <TextInput
    label="Contributor"
    name="contributor"
    placeholder="Contributor"
    required={true}
    message="Contributor Cannot be Empty"
  />
);

const _renderInputCreator = () => (
  <TextInput
    label="Creator"
    name="creator"
    placeholder="Creator"
    required={true}
    message="Creator Cannot be Empty"
  />
);

const _renderInputPublisher = () => (
  <TextInput
    label="Publisher"
    name="publisher"
    placeholder="Publisher"
    required={true}
    message="Publisher Cannot be Empty"
  />
);

const _renderInputIdentifier = () => (
  <TextInput
    label="Resource Identifier"
    name="resource_identifier"
    placeholder="Resource Identifier"
    required={true}
    message="Resource Identifier Cannot be Empty"
  />
);

const _renderInputRigths = () => (
  <TextInput
    label="Rights"
    name="rights"
    placeholder="Right"
    required={true}
    message="Rights Cannot be Empty"
  />
);

const _renderInputSource = () => (
  <TextInput
    label="Source"
    name="source"
    placeholder="Source"
    required={true}
    message="Source Cannot be Empty"
  />
);

const _renderInputSubject = () => (
  <TextInput
    label="Subject"
    name="subject"
    placeholder="Subject"
    required={true}
    message="Subject Cannot be Empty"
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

const _renderInputDescription = () => (
  <Form.Item
    label="Description"
    name="description"
    rules={[{ required: true, message: "Description Cannot Be Empty" }]}
  >
    <TextArea
      placeholder="Controlled autosize"
      autoSize={{
        minRows: 3,
        maxRows: 5,
      }}
    />
  </Form.Item>
);

const CreateBibliography = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.CATEGORIES}?limit=200`);
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
    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("contributor", form.contributor);
    formData.append("creator", form.creator);
    formData.append("description", form.description);
    formData.append("publisher", form.publisher);
    formData.append("resource_identifier", form.resource_identifier);
    formData.append("rights", form.rights);
    formData.append("source", form.source);
    formData.append("subject", form.subject);
    formData.append("title", form.title);
    if (form.image && form.image[0]) {
      formData.append("image", form.image[0].originFileObj);
    }

    try {
      setLoading(true);
      await axios.post(
        API_CONFIG.BIBLIOGRAPHIES,
        formData
      );
      showSuccessNotification("Success Adding New Bibliography");
      navigate(PATH.BIBLIOGRAPHY);
    } catch (error) {
      console.log(error);
      showErrorNotification(error.response.data.message);
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
        {_renderInputTitle()}
        {_renderInputDescription()}
        {_renderInputContributor()}
        {_renderInputCreator()}
        {_renderInputPublisher()}
        {_renderInputIdentifier()}
        {_renderInputRigths()}
        {_renderInputSource()}
        {_renderInputSubject()}
        {_renderUploadImage()}
        {_renderButton(loading)}
      </Form>
    </ContentLayout>
  );
};

export default CreateBibliography;
