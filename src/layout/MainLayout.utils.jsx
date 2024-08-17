import {
  Table2,
  LayoutDashboard,
  BookCheck,
  FileStack,
  Boxes,
  UsersRound,
  LogOut,
} from "lucide-react";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Dashboard", "", <LayoutDashboard size={18}/>),
  getItem("Category", "category", <Boxes size={18}/>),
  getItem("Bibliography", "bibliography", <BookCheck size={18}/>),
  getItem("Table Of Content", "table-of-content", <Table2 size={18}/>),
  getItem("Content", "content", <FileStack size={18} />),
  getItem("User", "user", <UsersRound size={18}/>),
  getItem("Logout", "logout", <LogOut size={18}/>),
];

export default items;
