const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export const apiRequest = async (token,
  endpoint,
  options = {}
) => {
  // const token = sessionStorage.getItem("access_token");
  const headers = {
    "Content-type":"application/json",
    ...(options.headers || {}),
  };
  if(token){
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers,
    }
  );

  let data = null;

  try {
    data = await response.json();
    console.log("api.service",data);
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "API request failed"
    );
  }

  return data;
};