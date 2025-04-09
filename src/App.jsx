import { useEffect, useState, useMemo, useCallback } from "react";
import Search from "./components/Search";
import TodoList from "./components/TodoList";
import Filter from "./components/Filter";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    if (todos.length) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = useCallback((data) => {
    setTodos((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now(),
        status: "Active",
      },
    ]);
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id, text) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, task: text } : todo))
    );
  }, []);

  const completeTodo = useCallback((e, id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, status: e.target.checked ? "Completed" : "Active" }
          : todo
      )
    );
  }, []);

  const filteredTodos = useMemo(() => {
    return filter === "All"
      ? todos
      : todos.filter((todo) => todo.status === filter);
  }, [todos, filter]);

  return (
    <div className="todo-container">
      <h1 className="article-todo">To-do List</h1>
      <Search addTodo={addTodo} />
      <Filter onFilterTodo={setFilter} />
  
      <div className="todo-list-container-task">
        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          completeTodo={completeTodo}
          setTodos={setTodos}
        />
      </div>
    </div>
  );
}

export default App;
