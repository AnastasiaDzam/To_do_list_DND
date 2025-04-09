import "../index.css";
import React, { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FiSave } from "react-icons/fi";
import classNames from "classnames";

export const TodoCard = ({
  moveTodoCard,
  todo,
  completeTodo,
  deleteTodo,
  index,
  isEditing,
  onEditClick,
  onSaveEdit,
}) => {
  const ref = useRef(null);
  const editInputRef = useRef(null);
  const textRef = useRef(null);
  const timeoutRef = useRef(null);
  const [editText, setEditText] = useState(todo.task);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTextOverflowing(
        textRef.current.scrollWidth > textRef.current.clientWidth
      );
    }
  }, [todo.task]);

  const [{ handlerId, isOver }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTodoCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => ({ index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isEditing) {
      setEditText(todo.task);
      timeoutRef.current = setTimeout(() => editInputRef.current?.focus(), 0);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isEditing, todo.task]);

  const handleSave = () => {
    onSaveEdit(editText);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  drag(drop(ref));

  const itemClasses = classNames("todo-list-item", {
    "todo-list-item--dragging": isDragging,
    "todo-list-item--hover": isOver && !isDragging,
    "todo-list-item--draggable": !isEditing,
    "completed": todo.status === "Completed",
  });

  return (
    <div
      ref={ref}
      className={itemClasses}
      data-handler-id={handlerId}
      style={{
        cursor: isDragging ? "grabbing" : !isEditing ? "grab" : "default",
      }}
    >
      <div className="task">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={todo.status === "Completed"}
          onChange={(e) => completeTodo(e, todo.id)}
        />

        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input
              type="text"
              ref={editInputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="edit-input"
            />
          </form>
        ) : (
          <div className="task-text-wrapper">
            <div
              ref={textRef}
              className={classNames("task-text", {
                strike: todo.status === "Completed",
              })}
            >
              {todo.task}
            </div>
          </div>
        )}
      </div>

      <div className="btn-container">
        {isEditing ? (
          <button type="submit" className="save-btn">
            <FiSave size={15} />
          </button>
        ) : (
          <>
            <button
              className={classNames("edit-btn", {
                "completed-btn": todo.status === "Completed",
              })}
              onClick={onEditClick}
            >
              <CiEdit size={20} />
            </button>
            <button
              className={classNames("delete-btn", {
                "completed-btn": todo.status === "Completed",
              })}
              onClick={() => deleteTodo(todo.id)}
            >
              <AiOutlineDelete size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};