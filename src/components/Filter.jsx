import React from "react";
import CustomSelect from "./CustomSelect";

const FilterOptions = [
  { value: "All", label: "Все задачи" },
  { value: "Active", label: "Активные" },
  { value: "Completed", label: "Сделанные" },
];

const Filter = ({ onFilterTodo }) => {
  return (
    <div className="todo-filter">
      <CustomSelect options={FilterOptions} onChange={onFilterTodo} />
    </div>
  );
};

export default Filter;
