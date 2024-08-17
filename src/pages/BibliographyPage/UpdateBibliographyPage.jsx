import { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, ButtonStyle, PATH } from "../../Constants";
import { Form, Select, Input, Upload, Button as AntdButton } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Button from "../../Components/ButtonComponent.jsx/Button";
import TextInput from "../../Components/TextInputComponent/TextInput";
import axios from "axios";
import Skeleton from "../../Components/SkeletonComponent/Skeleton";
import { useLocation, useNavigate } from "react-router-dom";
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

const _renderSelect = (categories, defaultValue) => (
  <Form.Item
    initialValue={defaultValue}
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

const _renderInputTitle = (defaultValue) => (
  <TextInput
    value={defaultValue}
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

const _renderInputContributor = (defaultValue) => (
  <TextInput
    value={defaultValue}
    label="Contributor"
    name="contributor"
    placeholder="Contributor"
    required={true}
    message="Contributor Cannot be Empty"
  />
);

const _renderInputCreator = (defaultValue) => (
  <TextInput
    value={defaultValue}
    label="Creator"
    name="creator"
    placeholder="Creator"
    required={true}
    message="Creator Cannot be Empty"
  />
);

const _renderInputPublisher = (defaultValue) => (
  <TextInput
    value={defaultValue}
    label="Publisher"
    name="publisher"
    placeholder="Publisher"
    required={true}
    message="Publisher Cannot be Empty"
  />
);

const _renderInputIdentifier = (defaultValue) => (
  <TextInput
    value={defaultValue}
    label="Resource Identifier"
    name="resource_identifier"
    placeholder="Resource Identifier"
    required={true}
    message="Resource Identifier Cannot be Empty"
  />
);

const _renderInputRigths = (defaultValue) => (
  <TextInput
    value={defaultValue}
    label="Rights"
    name="rights"
    placeholder="Right"
    required={true}
    message="Rights Cannot be Empty"
  />
);

const _renderInputSource = (defaultValue) => (
  <TextInput
    value={defaultValue}
    label="Source"
    name="source"
    placeholder="Source"
    required={true}
    message="Source Cannot be Empty"
  />
);

const _renderInputSubject = (defaultValue) => (
  <TextInput
    value={defaultValue}
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

const _renderInputDescription = (defaultValue) => (
  <Form.Item
    initialValue={defaultValue}
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

const UpdateBiblipgraphyPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

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
    formData.append("id", id);
    formData.append("prevTitle", state.title);
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
      await axios.put(
        API_CONFIG.BIBLIOGRAPHIES,
        formData
      );
      showSuccessNotification("Success Update Bibliography!");
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
        {_renderSelect(categories, state.category._id)}
        {_renderInputTitle(state.title)}
        {_renderInputDescription(state.description)}
        {_renderInputContributor(state.contributor)}
        {_renderInputCreator(state.creator)}
        {_renderInputPublisher(state.publisher)}
        {_renderInputIdentifier(state.resource_identifier)}
        {_renderInputRigths(state.rights)}
        {_renderInputSource(state.source)}
        {_renderInputSubject(state.subject)}
        {_renderUploadImage()}
        {_renderButton(loading)}
      </Form>
    </ContentLayout>
  );
};

export default UpdateBiblipgraphyPage;
