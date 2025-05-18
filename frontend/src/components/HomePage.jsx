import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <>
      <Navbar></Navbar> <Outlet /> <Footer />
    </>
  );
};

export default HomePage;
