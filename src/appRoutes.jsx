import MainLayout from "./layout/MainLayout";
import Category from "./pages/CategoryPage/Category";
import CreateCategory from "./pages/CategoryPage/CreateCategory";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import { PATH } from "./Constants";
import Bibliography from "./pages/BibliographyPage/BibliographyPage";
import CreateBibliography from "./pages/BibliographyPage/CreateBibliography";
import TableOfContent from "./pages/TableOfContentPage/TableOfContentPage";
import Content from "./pages/ContentPage/ContentPage";
import TableOfContentCreate from "./pages/TableOfContentPage/CreateTableOfContentPage";
import ContentCreate from "./pages/ContentPage/CreateContentPage";
import UpdateCategory from "./pages/CategoryPage/UpdateCategory";
import UpdateBiblipgraphyPage from "./pages/BibliographyPage/UpdateBibliographyPage";
import UpdateTableOfContent from "./pages/TableOfContentPage/UpdateTableOfContentPage";
import UpdateContentPage from "./pages/ContentPage/UpdateContentPage";
import SignInPage from "./pages/Auth/SignInPage";
import UserPage from "./pages/UserPage/UserPage";
import CreateUser from "./pages/UserPage/CreateUserPage";

const appRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: PATH.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: PATH.CATEGORY,
        element: <Category />,
      },
      {
        path: PATH.CREATE_CATEGORY,
        element: <CreateCategory />,
      },
      {
        path: PATH.BIBLIOGRAPHY,
        element: <Bibliography />,
      },
      {
        path: PATH.CREATE_BIBLIOGRAPHY,
        element: <CreateBibliography />,
      },
      {
        path: PATH.TABLE_OF_CONTENT,
        element: <TableOfContent />,
      },
      {
        path: PATH.CONTENT,
        element: <Content />,
      },
      {
        path: PATH.CREATE_TABLE_OF_CONTENT,
        element: <TableOfContentCreate />,
      },
      {
        path: PATH.CREATE_CONTENT,
        element: <ContentCreate />,
      },
      {
        path: PATH.UPDATE_CATEGORY,
        element: <UpdateCategory />,
      },
      {
        path: PATH.UPDATE_BIBLIOGRAPHY,
        element: <UpdateBiblipgraphyPage />,
      },
      {
        path: PATH.UPDATE_TABLE_OF_CONTENT,
        element: <UpdateTableOfContent />,
      },
      {
        path: PATH.UPDATE_CONTENT,
        element: <UpdateContentPage />,
      },
      {
        path: PATH.USER,
        element: <UserPage />,
      },
      {
        path: PATH.CREATE_USER,
        element : <CreateUser/>
      }
    ],
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
];

export default appRoutes;
