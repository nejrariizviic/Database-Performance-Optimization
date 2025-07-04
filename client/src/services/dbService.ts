import axios from "axios";

const apiDbClient = axios.create({
  baseURL: "https://localhost:7001/api/index",
});
const apiDbProfilerClient = axios.create({
  baseURL: "https://localhost:7001/profiler",
});

export async function AddIndexes() {
  const res = await apiDbClient.post("/create");
  return res.data;
}

export async function DropIndexes() {
  const res = await apiDbClient.post("/drop");
  return res.data;
}

export async function FetchProfilerMetrics(id: string) {
  const res = await apiDbProfilerClient.get("/results", {
    params: { id },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
}
