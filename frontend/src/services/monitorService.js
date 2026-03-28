import api from "./api";

export const getMonitors = async () => {
  const res = await api.get("/monitor");
  return res.data;
};

export const getLogs = async (id, page = 1, limit = 50) => {
  const res = await api.get(`/monitor/${id}/logs?page=${page}&limit=${limit}`);
  return res.data;
};