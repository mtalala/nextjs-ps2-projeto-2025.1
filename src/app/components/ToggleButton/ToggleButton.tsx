"use client";
import "./ToggleButton.css";
import { useEffect } from "react";

const ToggleButton = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      <div className="theme-toggle-ball"></div>
    </div>
  );
};

export default ToggleButton;
