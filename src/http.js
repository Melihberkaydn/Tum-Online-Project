export async function fetchAvailableClasses() {
  const response = await fetch("http://localhost:3000/classes");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch classes.");
  }

  return resData.places;
}

export async function fetchUserClasses() {
  const response = await fetch("http://localhost:3000/user-places");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch user places");
  }

  return resData.places;
}
