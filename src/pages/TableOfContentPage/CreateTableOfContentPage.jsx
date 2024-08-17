import React, { useEffect, useState } from "react";
import {
  Input,
  Breadcrumb,
  Form,
  notification,
  Select,
  message,
  Spin,
} from "antd";
import ButtonComponent from "../../Components/ButtonComponent.jsx/Button";
import { useNavigate } from "react-router-dom";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, PATH } from "../../Constants";
import axios from "axios";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notification";
import { LoadingOutlined } from "@ant-design/icons";

const breadCrumbItem = [
  {
    key: "Dashboard",
    href: PATH.DASHBOARD,
    name: "Dashboard",
  },
  {
    key: "Table Of Conten",
    href: PATH.TABLE_OF_CONTENT,
    name: "Table Of Content",
  },
  {
    key: "Create",
    name: "Create",
  },
];

const MaxLevels = 10;

const levelBorderColors = [
  "#3498db", // Level 0: Blue
  "#e74c3c", // Level 1: Red
  "#f1c40f", // Level 2: Yellow
  "#2ecc71", // Level 3: Green
  "#9b59b6", // Level 4: Purple
  "#34495e", // Level 5: Dark Blue
  "#1abc9c", // Level 6: Teal
  "#f39c12", // Level 7: Orange
  "#d35400", // Level 8: Deep Orange
  "#c0392b", // Level 9: Reddish Brown
];

const NestedInput = ({
  level,
  data,
  onChange,
  onRemove,
  parentBorderColor,
}) => {
  const { page, title, children } = data;

  const handlePageChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "" || /^\d+$/.test(newValue)) {
      // Cek apakah nilai adalah angka
      const newPage = newValue === "" ? "" : parseInt(newValue, 10);
      onChange({ ...data, page: newPage });
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    onChange({ ...data, title: newText });
  };

  const handleChildChange = (childIndex, childData) => {
    const newChildren = [...children];
    newChildren[childIndex] = childData;
    onChange({ ...data, children: newChildren });
  };

  const addChild = () => {
    if (level < MaxLevels) {
      const newChild = { page: "", title: "", children: [] };
      onChange({ ...data, children: [...children, newChild] });
    }
  };

  const removeChild = (childIndex) => {
    const newChildren = [...children];
    newChildren.splice(childIndex, 1);
    onChange({ ...data, children: newChildren });
  };

  const borderColor = levelBorderColors[level] || parentBorderColor;
  const parentBorderStyle = {
    border: `1px solid ${borderColor}`,
    padding: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={{ ...parentBorderStyle, marginLeft: level * 10 }}>
      <div>
        <label>Page:</label>
        <Input
          className="mt-1 mb-1"
          type="text"
          value={page}
          onChange={handlePageChange}
        />
      </div>
      <div>
        <label>Title:</label>
        <Input
          className="mb-1 mt-1"
          type="text"
          value={title}
          onChange={handleTextChange}
        />
      </div>
      <div className="my-2 flex gap-1">
        {level < MaxLevels && (
          <ButtonComponent
            className="text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer font-bold"
            onClick={addChild}
            disabled={children.length >= MaxLevels}
          >
            Add Sub Chapter
          </ButtonComponent>
        )}
        {level > 0 && (
          <ButtonComponent
            variant="danger"
            style={{
              borderColor: "red",
              backgroundColor: "red",
              marginLeft: "10px",
            }}
            onClick={onRemove}
            className="text-white bg-red-500 hover:bg-red-700 transition-all cursor-pointer font-bold"
            type="primary"
          >
            Delete Sub Chapter
          </ButtonComponent>
        )}
      </div>
      {children.map((childData, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          <NestedInput
            level={level + 1}
            data={childData}
            onChange={(newChildData) => handleChildChange(index, newChildData)}
            onRemove={() => removeChild(index)}
            parentBorderColor={borderColor} // Pass the parent's border color down to children
          />
        </div>
      ))}
    </div>
  );
};

const TableOfContentCreate = () => {
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bibliographies, setbibliographies] = useState([]);
  const [data, setData] = useState({
    page: "",
    title: "",
    children: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState(null);
  const handleDataChange = (newData) => {
    setData(newData);
  };

  const onChange = (value, label) => {
    setBook(label);
  };

  const navigate = useNavigate();

  const parentBorderColor = "#3498db";

  const handlerSubmit = async (value) => {
    if (!book) {
      setValidationError("Please select a Bibliography!");
      return;
    }
    setValidationError(null);
    const tableOfContent = { ...data, bibliography: book.value };
    try {
      setIsLoading(true);
      const response = await axios.post(
        API_CONFIG.TABLE_OF_CONTENT,
        tableOfContent
      );
      showSuccessNotification("Succes Adding New Table Of Content");
      navigate(PATH.TABLE_OF_CONTENT);
    } catch (error) {
      showErrorNotification(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBibliography = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.BIBLIOGRAPHIES}?limit=1000&categories=${[]}`
      );
      setbibliographies(response.data.bibliographies);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const optionBibliography = () =>
    bibliographies?.map((biblio) => ({
      label: biblio.title,
      value: biblio._id,
    }));

  useEffect(() => {
    fetchBibliography();
  }, []);

  return (
    <ContentLayout breadCrumbs={breadCrumbItem}>
      <>
        <Form layout="vertical">
          <Form.Item
            label="Bibliography"
            name="category"
            validateStatus={validationError ? "error" : ""}
            help={validationError}
            rules={[
              {
                required: true,
                message: "Please select a Bibliography!",
              },
            ]}
          >
            <Select
              options={optionBibliography()}
              showSearch
              onChange={onChange}
              placeholder="Select  Book"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
        <NestedInput
          level={0}
          data={data}
          onChange={handleDataChange}
          parentBorderColor={parentBorderColor}
        />
        <ButtonComponent
          onClick={handlerSubmit}
          disabled={isLoading}
          loading={isLoading}
          className="text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer font-bold"
        >
          Save
        </ButtonComponent>
      </>
    </ContentLayout>
  );
};

export default TableOfContentCreate;
