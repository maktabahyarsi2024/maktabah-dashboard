import { Input, Modal, Select, Space, Table, Tooltip } from "antd";
import Button from "../../Components/ButtonComponent.jsx/Button";
import { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import { API_CONFIG, PATH } from "../../Constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { SearchOutlined } from "@ant-design/icons";
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
    key: "Table Of Content",
    name: "Table Of Content",
  },
];

const _renderTable = (categories) => (
  <Table
    dataSource={categories}
    columns={columns}
    pagination={{ showTotal, total: 50 }}
    rowKey={(record) => record._id}
  />
);

const TableOfContent = () => {
  const navigate = useNavigate();
  const [tableOfContents, setTableOfContents] = useState([]);
  const [totalTableOfContent, setTotalTableOfContent] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("asc");
  const [bibliography, setBibliography] = useState([]);
  const [bibliographies, setbibliographies] = useState([
    { label: "f", value: "f" },
  ]);
  const itemsPerPage = 10;

  const columns = [
    {
      title: "Table Of Content Chapter",
      dataIndex: "title",
      key: "title",
      width: "40%",
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
                  navigate(
                    `${PATH.UPDATE_TABLE_OF_CONTENT}?id=${record._id}&title=${record.title}`,
                    {
                      state: {
                        title: record.title,
                        page: record.page,
                        children: record.children,
                        bibliographyTitle: record.bibliography.title,
                        bibliographyId: record.bibliography._id,
                      },
                    }
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
      await axios.delete(
        `${API_CONFIG.TABLE_OF_CONTENT}/${record._id}`
      );
      fetchTableOfContents();
      showSuccessNotification("Delete Succesfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      showErrorNotification("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchTableOfContents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.TABLE_OF_CONTENT}?keyword=${keyword}&page=${currentPage}&sortBy=${sortBy}&bibliography=${bibliography.join(
          ","
        )}`
      );
      setTableOfContents(response.data.tableOfContent);
      setTotalTableOfContent(response.data.total);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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

  const handleSearch = (event) => {
    console.log(event.target.value);
    setKeyword(event.target.value);
  };

  const handleNavigate = () => {
    navigate(PATH.CREATE_TABLE_OF_CONTENT);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showTotal = (total, range) =>
    `Showing ${range[0]} to ${range[1]} of ${total} entries`;

  const optionBibliography = () =>
    bibliographies.map((biblio) => ({
      label: biblio.title,
      value: biblio._id,
    }));

  useEffect(() => {
    fetchTableOfContents();
    fetchBibliography();
  }, [currentPage, keyword, sortBy, bibliography]);

  return (
    <>
      <ContentLayout breadCrumbs={breadCrumbItem}>
        <div className="flex justify-between mb-5">
          <div className="flex gap-2 w-9/12">
            <Input
              style={{
                width: "100%",
              }}
              placeholder="Search"
              className="w-72"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
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
          dataSource={tableOfContents}
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

export default TableOfContent;
