import { supabase } from "../supabase/client";

export async function fetchJobs(params = {}) {
  const {
    q = "",
    role = "",
    hours = "",
    location = "",
    type = "",
    tagIds = [],
    tagLogic = "and",
    page = 1,
    pageSize = 20,
    sort = "newest",
  } = params;

  const { data, error } = await supabase.rpc("search_jobs", {
    q,
    role_in: role,
    hours_in: hours,
    location_in: location,
    type_in: type,
    tag_ids_in: tagIds,
    tag_logic_in: tagLogic,
    page_in: page,
    page_size_in: pageSize,
    sort_in: sort,
  });

  if (error) throw error;
  return { ok: true, results: data || [], page, pageSize };
}

export async function addJobToFavorites(jobId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  await supabase.from("favorites").upsert({ user_id: user.id, job_id: jobId });
  return { ok: true };
}

export async function applyToJob(jobId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  await supabase.from("applications").upsert({ user_id: user.id, job_id: jobId });
  return { ok: true };
}

export async function getUserJobInteractions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { favorites: [], appliedJobs: [] };

  const [favs, apps] = await Promise.all([
    supabase.from("favorites").select("job_id").eq("user_id", user.id),
    supabase.from("applications").select("job_id").eq("user_id", user.id),
  ]);

  return {
    favorites: favs.data?.map(r => r.job_id) || [],
    appliedJobs: apps.data?.map(r => r.job_id) || [],
  };
}
