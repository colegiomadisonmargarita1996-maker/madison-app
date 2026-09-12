import { createClient } from "./supabase/client";

export async function loginWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getUserRole(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("rol")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.rol;
}
