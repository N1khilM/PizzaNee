const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `The API returned a non-JSON response (HTTP ${response.status}). Check the API URL and backend logs.`,
      );
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (HTTP ${response.status}).`);
  }

  return data;
}

export default API_BASE_URL;
