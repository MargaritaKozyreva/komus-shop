import React from "react";
import { Link } from "react-router-dom";
import './style.css';

const Button = ({ children, mode, to, onClick, className, ...attrs }) => {
  if (to) {
    return (
      <Link to={to} className={`${className} button ${mode} `} {...attrs}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${className} button ${mode} `} {...attrs}>
      {children}
    </button>
  );
};

export default Button;