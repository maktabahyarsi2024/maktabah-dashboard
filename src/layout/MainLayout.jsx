import * as React from "react";
import { Layout, Menu, Modal } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import items from "./MainLayout.utils";
import { accessUser } from "../Constants/access";

const { Footer, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const [filteredItem, setFilteredItem] = React.useState(items);
  const token = localStorage.getItem("auth");
  const role = localStorage.getItem("role");

  React.useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      const filteredItems = items.filter((item) => {
        if (item.key === "user") {
          return accessUser.viewer.includes(role);
        }
        return true; 
      });
      setFilteredItem(filteredItems);
    }
  }, [token, navigate]);

  const handleCollapsed = (value) => {
    setCollapsed(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");

    setTimeout(() => {
      navigate("/signin");
    }, 400);
  };

  const handleClick = (e) => {
    if (e.key === "logout") {
      Modal.confirm({
        okText: "Logout",
        okButtonProps: {
          className: "bg-red-500 hover:!bg-red-700",
        },
        title: `Are you sure want to Logout? `,
        onOk() {
          handleLogout();
        },
      });
    } else {
      navigate(e.key);
    }
  };

  return (
    <>
      {token && (
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => handleCollapsed(value)}
          >
            <Menu
              theme="dark"
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={filteredItem}
              onClick={handleClick}
            />
          </Sider>
          <Layout style={{ marginLeft: collapsed ? "80px" : "200px" }}>
            <Outlet />
            <Footer
              style={{
                textAlign: "center",
              }}
            >
              Dashboard Maktabah YARSI ©2023 Created by Muhammad Rizky Yuhari
            </Footer>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default MainLayout;
