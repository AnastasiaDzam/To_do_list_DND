import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";

const Search = memo(({ addTodo }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = React.useCallback(
    (data) => {
      addTodo(data);
      reset();
    },
    [addTodo, reset]
  );

  return (
    <div className="todo-search">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input
          type="text"
          id="task"
          placeholder="Добавить задачу"
          {...register("task", { required: true })}
          className="todo-search__input"
        />
        <button type="submit" className="todo-search__button">
          <AiOutlinePlus size={20} className="todo-search__icon" />
        </button>
      </form>
      {errors.task?.type === "required" && (
        <small className="todo-search__error">Напиши задачу</small>
      )}
    </div>
  );
});

export default Search;
