import { Outlet } from "react-router-dom";
import Navlogged from "../components/Navlogged";

const MainLayout = () => {
  return (
    <>
      <Navlogged />
      <Outlet />
    </>
  );
};

export default MainLayout;
