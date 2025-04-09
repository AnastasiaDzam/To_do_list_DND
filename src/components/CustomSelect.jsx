import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    onChange(e.target.value);
    setIsOpen(false);
  };

  const handleMouseDown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <select
      ref={selectRef}
      className={`custom-select ${isOpen ? "flipped" : ""}`}
      value={value}
      onChange={handleChange}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      onMouseDown={handleMouseDown}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
