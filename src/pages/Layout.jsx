// Layout.jsx
import { Footer } from "../components/Ui/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Ui/Navbar";
import { MenuFlotante } from "../components/Ui/MenuFlotante";
import BackgroundMusic from "../components/Ui/MusicaFondo";
import { BottomBar } from "../components/Ui/BottomBar";


const Layout = () => {

  return (
    <>

      <div >
        <Navbar />
        <Outlet />
        <MenuFlotante />
        <Footer />
        <BottomBar />
        <BackgroundMusic />
      </div>
    </>
  );
};

export default Layout