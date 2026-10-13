import { supabase } from './supabase.js';

async function list(table, order) {
  try {
    let q = supabase.from(table).select('*');
    if (order) q = q.order(order, { ascending: false });
    const { data, error } = await q;
    return { items: Array.isArray(data) ? data : [], error };
  } catch (e) {
    return { items: [], error: e };
  }
}

export const fetchUsers = () => list('profiles', 'created_at');

export const userCrud = {
  create: async (p) => supabase.from('profiles').insert(p).select().single(),
  update: async (id, p) => supabase.from('profiles').update(p).eq('id', id),
  remove: async (id) => supabase.from('profiles').delete().eq('id', id),
};
