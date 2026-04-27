import { api } from "../client";

// Get creator dashboard data
export const getCreatorDashboard = async () => {
    const res = await api.get("/Creator/dashboard");
    return res.data;
  };