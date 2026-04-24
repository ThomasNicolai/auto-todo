import { supabase } from "@/utils/supabase";

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getTodo(id: string): Promise<Todo | null> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function insertTodo(title: string): Promise<Todo> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from("todos")
    .insert({ title, user_id: session!.user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTodoTitle(id: string, title: string): Promise<void> {
  const { error } = await supabase.from("todos").update({ title }).eq("id", id);
  if (error) throw error;
}

export async function toggleTodo(id: string, completed: boolean): Promise<void> {
  const { error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
}
