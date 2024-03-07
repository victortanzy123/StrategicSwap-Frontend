export async function fetchRoute(route: string, req: RequestInit | undefined) {
  try {
    const response = await fetch(route, req);
    if (response.status === 200) {
      const res = await response.json();
      console.log(res.message);
      return res.data;
    } else {
      console.error(response);
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

