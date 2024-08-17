import { useEffect, useState, useRef } from "react";
import ContentLayout from "../../layout/ContentLayout";
import Button from "../../Components/ButtonComponent.jsx/Button";
import { API_CONFIG, ButtonStyle, PATH } from "../../Constants";
import { Form, Input, Select } from "antd";
import axios from "axios";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../utils/notification";
import JoditEditor from "jodit-react";
import { useLocation, useNavigate } from "react-router-dom";

const editorConfig = {
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "paragraph",
    "align",
    "|",
    "image",
    "link",
    "undo",
    "redo",
  ],
};

const breadCrumbItem = [
  {
    key: "Dashboard",
    href: PATH.DASHBOARD,
    name: "Dashboard",
  },
  {
    key: "Content",
    href: PATH.CONTENT,
    name: "Content",
  },
  {
    key: "Update",
    name: "Update",
  },
];

const UpdateContentPage = () => {
  const location = useLocation();
  const { state } = location;
  const editor = useRef(null);
  const [content, setContent] = useState(state.text);
  const navigate = useNavigate();

  const [validationError, setValidationError] = useState(null);
  const [validationErrorPage, setValidationPageError] = useState(null);
  const [book, setBook] = useState(state.bibliographyId);
  const [page, setPage] = useState(state.page);
  const [loading, setLoading] = useState(false);
  const [bibliographies, setbibliographies] = useState([]);

  const submitHandler = async () => {
    if (!book) {
      setValidationError("Please select a Bibliography!");
      return;
    }
    if (!page) {
      setValidationPageError("Please select a Bibliography Page!");
      return;
    }
    setValidationError(null);
    setValidationPageError(null);

    const payload = {
      prevPage: state.page,
      prevBibliography: state.bibliographyId,
      page,
      bibliography: book,
      text: content,
      contentID: state.contentID,
    };
    await createContent(payload, state.contentID);
  };

  const onChange = (value) => {
    setBook(value);
  };

  const handlerPage = (e) => {
    setPage(e.target.value);
  };

  const createContent = async (payload, contentID) => {
    try {
      setLoading(true);
      await axios.put(API_CONFIG.CONTENT, payload);
      showSuccessNotification("Success Update Content");
      navigate(PATH.CONTENT);
    } catch (error) {
      if (error.response.status === 409) {
        showErrorNotification("Cannot Update Content, Content is Duplicate!");
        return;
      }
      showErrorNotification(error.response.data.message);
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
            initialValue={state.bibliographyTitle}
            label="Bibliography"
            name="bibliography"
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
          <Form.Item
            label="Page"
            validateStatus={validationErrorPage ? "error" : ""}
            help={validationErrorPage}
          >
            <Input
              defaultValue={state.page}
              name="page"
              onChange={handlerPage}
              placeholder="Insert Bibliography Page"
            />
          </Form.Item>
        </Form>
        <div className="mb-2">
          <JoditEditor
            config={editorConfig}
            ref={editor}
            value={content}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>
        <Button
          disabled={loading}
          loading={loading}
          className={ButtonStyle.SAVE}
          onClick={submitHandler}
        >
          Save Content{" "}
        </Button>
      </>
    </ContentLayout>
  );
};

export default UpdateContentPage;
