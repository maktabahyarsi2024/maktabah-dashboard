import { Input, Space, Table, Tooltip, Modal } from "antd";
import Button from "../../Components/ButtonComponent.jsx/Button";
import { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, PATH } from "../../Constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2, Search } from "lucide-react";
import { SearchOutlined } from "@ant-design/icons";
import ModalConfirmation from "../../Components/ModalComponent/ModalConfirmation";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notification";

const breadCrumbItem = [
  {
    key: "Dashboard",
    href: PATH.DASHBOARD,
    name: "Dashboard",
  },
  {
    key: "Category",
    name: "Category",
  },
];

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const itemsPerPage = 10;

  const columns = [
    {
      title: "Nama Kategori",
      dataIndex: "title",
      key: "title",
      width: "90%",
    },
    {
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
                    `${PATH.UPDATE_CATEGORY}?id=${record._id}&title=${record.title}`
                  )
                }
              />
            </div>
          </Tooltip>
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
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.CATEGORIES}?page=${currentPage}&keyword=${keyword}`
      );
      setCategories(response.data.categories);
      setTotalCategories(response.data.total);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setKeyword(event.target.value);
  };

  const handleNavigate = () => {
    navigate(PATH.CREATE_CATEGORY);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showDeleteConfirmation = (record) => {
    Modal.confirm({
      okText: "Delete",
      okButtonProps: {
        className: "bg-red-500 hover:!bg-red-700",
        loading: loading,
      },
      title: `Are you sure want to delete ${record.title}? `,
      onOk() {
        handleDelete(record);
      },
    });
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.delete(
        `${API_CONFIG.CATEGORIES}/${record._id}`
      );
      fetchCategories();
      showSuccessNotification("Delete Succesfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      showErrorNotification("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const showTotal = (total, range) =>
    `Showing ${range[0]} to ${range[1]} of ${total} entries`;

  useEffect(() => {
    fetchCategories();
  }, [currentPage, keyword]);

  return (
    <>
      <ContentLayout breadCrumbs={breadCrumbItem}>
        <div className="flex justify-between mb-5">
          <Input
            placeholder="Search"
            className="w-72"
            prefix={<SearchOutlined />}
            onChange={handleSearch}
          />
          <div className="">
            <Button
              className="text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer font-bold"
              onClick={handleNavigate}
            >
              + Add New
            </Button>
          </div>
        </div>

        <Table
          dataSource={categories}
          columns={columns}
          pagination={{
            showTotal,
            total: totalCategories,
            pageSize: itemsPerPage,
            current: currentPage,
            onChange: handlePageChange,
          }}
          rowKey={(record) => record._id}
          scroll={{ x: true, y: 280 }}
          loading={loading}
        />
      </ContentLayout>
    </>
  );
};

export default Category;
