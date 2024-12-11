import React from "react";
import PropTypes from "prop-types";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Drawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div 
      className={`drawer-backdrop ${isOpen ? "active" : ""}`} 
      onClick={onClose}>
      <div className={`drawer ${isOpen ? "active" : ""}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-drawer-btn" onClick={onClose}>
          ✕
        </button>
        <ul>
              <li onClick={() => navigate("/securearbitrage")}>Home</li>
              <li onClick={() => navigate("/securearbitrage")}>About Us</li>
              <li onClick={() => navigate("/securearbitrage")}>Contact Us</li>
              <li onClick={() => navigate("/securearbitrage")}>Bot</li>
              <li onClick={() => navigate("/securearbitrage")}>Pricing</li>
              <li onClick={() => navigate("/securearbitrage")}>How It Works</li>
              <li onClick={() => navigate("/securearbitrage")}>Faqs</li>
            </ul>
      </div>
    </div>
  );
};

Drawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
};

export default Drawer;
