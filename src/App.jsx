import { RouterProvider, createBrowserRouter } from "react-router-dom";
import appRoutes from "./appRoutes";

const routes = createBrowserRouter(appRoutes);

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
