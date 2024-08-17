import { Layout } from "antd";
import BreadCrumb from "../Components/BreadCrumbComponent/BreadCrumb";

const { Content } = Layout;

const ContentLayout = ({ children, breadCrumbs, bgColor }) => {
  return (
    <Content className="px-4 py-5 bg-cuk">
      {breadCrumbs && <BreadCrumb items={breadCrumbs} />}
      <div className={`bg-white p-6 rounded-xl min-h-custom ${bgColor}`}>{children}</div>
    </Content>
  );
};

export default ContentLayout;
