import React, { useState, useCallback } from "react";
import { TodoCard } from "./TodoCard";
import update from "immutability-helper";

const TodoList = ({
  todos,
  deleteTodo,
  updateTodo,
  completeTodo,
  setTodos,
}) => {
  const [editingTodoId, setEditingTodoId] = useState(null);

  const moveTodoCard = useCallback((dragIndex, hoverIndex) => {
    setTodos((prevTodos) =>
      update(prevTodos, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTodos[dragIndex]],
        ],
      })
    );
  }, []);

  const handleEditClick = useCallback((id) => {
    setEditingTodoId(id);
  }, []);

  const handleSaveEdit = useCallback(
    (id, newText) => {
      if (!newText.trim()) {
        return;
      }
      updateTodo(id, newText);
      setEditingTodoId(null);
    },
    [updateTodo]
  );

  // Обработка пустого состояния
  if (todos.length === 0) {
    return (
      <div className="todo-list todo-list--empty">
        <p>Задач пока нет</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <TodoCard
            key={todo.id}
            index={index}
            todo={todo}
            moveTodoCard={moveTodoCard}
            completeTodo={completeTodo}
            deleteTodo={deleteTodo}
            isEditing={editingTodoId === todo.id}
            onEditClick={() => handleEditClick(todo.id)}
            onSaveEdit={(newText) => handleSaveEdit(todo.id, newText)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
