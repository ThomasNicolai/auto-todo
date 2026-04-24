import { useCallback, useEffect, useState } from "react";
import {
  getTodos,
  insertTodo,
  updateTodoTitle,
  toggleTodo,
  deleteTodo,
  type Todo,
} from "@/lib/database";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setTodos(await getTodos());
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTodo = useCallback(
    async (title: string) => {
      await insertTodo(title);
      await refresh();
    },
    [refresh],
  );

  const editTodo = useCallback(
    async (id: string, title: string) => {
      await updateTodoTitle(id, title);
      await refresh();
    },
    [refresh],
  );

  const toggleTodoItem = useCallback(
    async (id: string, completed: boolean) => {
      await toggleTodo(id, completed);
      await refresh();
    },
    [refresh],
  );

  const removeTodo = useCallback(
    async (id: string) => {
      await deleteTodo(id);
      await refresh();
    },
    [refresh],
  );

  return { todos, loading, error, addTodo, editTodo, toggleTodoItem, removeTodo, refresh };
}
