type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method?: ApiMethod;
  body?: any;
}

export const apiRequest = async (
  url: string,
  options: ApiOptions = {}
) => {
  const { method = "GET", body } = options;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
