import { FaCode, FaLaptop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import "./Header.css";

const Header = ({ title, width }) => {
  return (
    <header className="Header">
        <FaCode />
        <h1>{title}</h1>
      {width < 768 ? (
        <FaMobileAlt />
      ) : width < 992 ? (
        <FaTabletAlt />
      ) : (
        <FaLaptop />
      )}
    </header>
  );
};

export default Header;
