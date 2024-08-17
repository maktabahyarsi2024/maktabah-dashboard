import { Image, Input, Modal, Select, Space, Table, Tooltip } from "antd";
import Button from "../../Components/ButtonComponent.jsx/Button";
import { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, PATH } from "../../Constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2, UploadCloud, Ban } from "lucide-react";

import { SearchOutlined } from "@ant-design/icons";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notification";
import { accessUser } from "../../Constants/access";

const breadCrumbItem = [
  {
    key: "Dashboard",
    href: PATH.DASHBOARD,
    name: "Dashboard",
  },
  {
    key: "Bibliography",
    name: "Bibliography",
  },
];

const _transformCategories = (categories) => {
  return categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));
};

const Bibliography = () => {
  const navigate = useNavigate();
  const [bibliographies, setBibliographies] = useState([]);
  const [totalBibliographies, setTotalBibliographies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [publishedStatus, setPublishedStatus] = useState(false);
  const itemsPerPage = 10;

  const checkingAccess = () => {
    const userRole = localStorage.getItem("role");
    return accessUser.edit.includes(userRole);
  };

  const columns = [
    {
      title: "Bibliography",
      dataIndex: "title",
      key: "title",
      fixed: "left",
    },
    {
      title: "Cover",
      dataIndex: "image",
      key: "image",
      fixed: "left",
      render: (image) => (
        <Image width={50} height={50} src={`${API_CONFIG.IMAGES}/${image}`} />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => category.title,
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
    },
    {
      fixed: "right",
      width: "15%",
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip placement="topLeft" title="Update">
            <div className="cursor-pointer bg-mtb-green p-2 rounded-lg">
              <Pencil
                color="white"
                size={20}
                onClick={() =>
                  navigate(
                    `${PATH.UPDATE_BIBLIOGRAPHY}?id=${record._id}&title=${record.title}`,
                    {
                      state: {
                        ...record,
                      },
                    }
                  )
                }
              />
            </div>
          </Tooltip>
          {checkingAccess() && (
            <div className="cursor-pointer bg-yellow-400 p-2 rounded-lg">
              {record.published ? (
                <Tooltip placement="topLeft" title="Take Down">
                  <Ban
                    color="white"
                    size={20}
                    onClick={() => showTakeDownConfirmation(record)}
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="topLeft" title="Publish">
                  <UploadCloud
                    color="white"
                    size={20}
                    onClick={() => showPublishConfirmation(record)}
                  />
                </Tooltip>
              )}
            </div>
          )}

          <Tooltip placement="topLeft" title="Delete">
            <div className="cursor-pointer bg-mtb-red p-2 rounded-lg">
              <Trash2
                color="white"
                size={20}
                onClick={() => showDeleteConfirmation(record)}
              />
            </div>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showDeleteConfirmation = (record) => {
    Modal.confirm({
      okText: "Delete",
      okButtonProps: {
        className: "bg-red-500 hover:!bg-red-700",
        loading: loading,
      },
      title: (
        <>
          <span>Are you sure want to delete </span>
          <span className="text-red-500">{`${record.title}`}</span>
          <span> ?</span>
        </>
      ),
      onOk() {
        handleDelete(record);
      },
    });
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.delete(`${API_CONFIG.BIBLIOGRAPHY}/${record._id}`);
      showSuccessNotification("Delete Succesfully!");
      fetchBibliographies();
    } catch (error) {
      if (error.response.status === 409) {
        showErrorNotification(error.response.data.message);
        return;
      }
      showErrorNotification("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

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

  const fetchBibliographies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          API_CONFIG.BIBLIOGRAPHIES
        }?page=${currentPage}&keyword=${keyword}&categories=${category.join(
          ","
        )}`
      );
      setBibliographies(response.data.bibliographies);
      setTotalBibliographies(response.data.total);
    } catch (error) {
      console.error("Error fetching bibliographies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setKeyword(event.target.value);
  };

  const handleNavigate = () => {
    navigate(PATH.CREATE_BIBLIOGRAPHY);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePublish = async (record) => {
    const payload = { bibliography: record._id, published: true };
    try {
      await axios.put(API_CONFIG.CHANGE_PUBLISHED_STATUS, payload);
      setPublishedStatus((prev) => !prev);
      showSuccessNotification("Success Publish Bibliography!");
    } catch (error) {
      showSuccessNotification(
        "Something Went Wrong!, Failed Publish Bibliography!"
      );
    }
  };

  const showPublishConfirmation = (record) => {
    Modal.confirm({
      okText: "Publish Bibliography",
      okButtonProps: {
        className: "bg-yellow-400 hover:!bg-yellow-600",
        loading: loading,
      },
      title: (
        <>
          <span>Are you sure want to publish </span>
          <span className="text-red-500">{`${record.title}`}</span>
          <span> ?</span>
        </>
      ),
      onOk() {
        handlePublish(record);
      },
    });
  };

  const handleTakeDown = async (record) => {
    const payload = { bibliography: record._id, published: false };
    try {
      await axios.put(API_CONFIG.CHANGE_PUBLISHED_STATUS, payload);
      setPublishedStatus((prev) => !prev);
      showSuccessNotification("Success Take Down Bibliography!");
    } catch (error) {
      showSuccessNotification(
        "Something Went Wrong!, Failed Take Down Bibliography!"
      );
    }
  };

  const showTakeDownConfirmation = (record) => {
    Modal.confirm({
      okText: "Take Down Bibliography",
      okButtonProps: {
        className: "bg-red-500 hover:!bg-red-700",
        loading: loading,
      },
      title: (
        <>
          <span>Are you sure want to take down </span>
          <span className="text-red-500">{`${record.title}`}</span>
          <span> ?</span>
        </>
      ),
      onOk() {
        handleTakeDown(record);
      },
    });
  };

  const showTotal = (total, range) =>
    `Showing ${range[0]} to ${range[1]} of ${total} entries`;

  useEffect(() => {
    fetchCategories();
    fetchBibliographies();
  }, [currentPage, keyword, category, publishedStatus]);

  return (
    <>
      <ContentLayout breadCrumbs={breadCrumbItem}>
        <div className="flex justify-between mb-5 w-full">
          <div className="flex gap-2 w-9/12">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              style={{ width: "100%" }}
            />
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => setCategory(value)}
              placeholder="Filter By Category"
              options={_transformCategories(categories)}
              maxTagCount="responsive"
            />
          </div>
          <div className="">
            <Button
              disabled={loading}
              className="text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer font-bold"
              onClick={handleNavigate}
            >
              + Add New
            </Button>
          </div>
        </div>

        <Table
          dataSource={bibliographies}
          columns={columns}
          pagination={{
            showTotal,
            total: totalBibliographies,
            pageSize: itemsPerPage,
            current: currentPage,
            onChange: handlePageChange,
          }}
          rowKey={(record) => record._id}
          scroll={{ x: 1300, y: 280 }}
          loading={loading}
        />
      </ContentLayout>
    </>
  );
};

export default Bibliography;
