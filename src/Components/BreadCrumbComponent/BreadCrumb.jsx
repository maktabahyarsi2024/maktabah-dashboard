import { Breadcrumb } from "antd";

const BreadCrumb = ({ items }) => {
  return (
    <div className="bg-white mb-5 rounded-xl">
      <Breadcrumb className="pl-3 py-3">
        {items.map((item) => (
          <Breadcrumb.Item href={item.href} key={item.key}>
            {item.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
