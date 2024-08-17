import { Input, Modal, Select, Space, Table, Tooltip } from "antd";
import Button from "../../Components/ButtonComponent.jsx/Button";
import { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, PATH } from "../../Constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { SearchOutlined } from "@ant-design/icons";
import removeHtmlTags from "../../utils/removeContent";
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
    key: "Content",
    name: "Content",
  },
];

const Content = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [totalTableOfContent, setTotalTableOfContent] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [bibliography, setBibliography] = useState([]);
  const [bibliographies, setbibliographies] = useState([
    { label: "f", value: "f" },
  ]);
  const [sortBy, setSortBy] = useState("asc");
  const itemsPerPage = 10;

  const columns = [
    {
      title: "Content",
      dataIndex: "text",
      key: "text",
      width: "40%",
      render: (text) => {
        const maxLength = 100;
        if (text.length > maxLength) {
          return removeHtmlTags(text.substring(0, maxLength)) + "...";
        }
        return removeHtmlTags(text.substring(0, maxLength));
      },
    },
    {
      title: "Bibliography",
      dataIndex: "bibliography",
      key: "bibliography",
      render: (bibliography) => bibliography.title,
    },
    {
      title: "Page",
      dataIndex: "page",
      key: "page",
    },
    {
      width: "10%",
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
                  navigate(`${PATH.UPDATE_CONTENT}?id=${record._id}`, {
                    state: {
                      contentID: record._id,
                      page: record.page,
                      bibliographyTitle: record.bibliography.title,
                      bibliographyId: record.bibliography._id,
                      text: record.text,
                    },
                  })
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

  const showDeleteConfirmation = (record) => {
    Modal.confirm({
      okText: "Delete",
      okButtonProps: {
        className: "bg-red-500 hover:!bg-red-700",
        loading: loading,
      },
      title: (
        <>
          <span>Are you sure want to delete Bibliography </span>
          <span className="text-red-500">{` "${record.bibliography.title}" page ${record.page}`}</span>
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
      await axios.delete(
        `${API_CONFIG.CONTENT}?id=${record._id}&page=${record.page}`
      );
      fetchContents();
      showSuccessNotification("Delete Succesfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      showErrorNotification("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.CONTENT}?keyword=${keyword}&bibliography=${bibliography.join(
          ","
        )}&sortBy=${sortBy}&page=${currentPage}`
      );
      setContents(response.data.contents);
      setTotalTableOfContent(response.data.total);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const optionBibliography = () =>
    bibliographies.map((biblio) => ({
      label: biblio.title,
      value: biblio._id,
    }));

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

  const handleSearch = (event) => {
    setKeyword(event.target.value);
  };

  const handleNavigate = () => {
    navigate(PATH.CREATE_CONTENT);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showTotal = (total, range) =>
    `Showing ${range[0]} to ${range[1]} of ${total} entries`;

  useEffect(() => {
    fetchContents();
    fetchBibliography();
  }, [currentPage, keyword, bibliography, sortBy]);

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
              placeholder="Filter By Bibliography"
              options={optionBibliography()}
              maxTagCount="responsive"
              onChange={(value) => setBibliography(value)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
            <Select
              style={{
                width: "100%",
                height: "100%",
              }}
              onChange={(value) => setSortBy(value)}
              placeholder="Sort By Page"
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
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
          dataSource={contents}
          columns={columns}
          pagination={{
            showTotal,
            total: totalTableOfContent,
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

export default Content;
