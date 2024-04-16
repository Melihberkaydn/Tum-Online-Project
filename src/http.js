export async function fetchAvailableClasses() {
  const response = await fetch("http://localhost:3000/classes");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch classes.");
  }

  return resData.classes;
}

export async function fetchUserClasses() {
  const response = await fetch("http://localhost:3000/user-classes");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch user classes");
  }

  return resData.classes;
}

export async function updateUserClasses(classes) {
  const response = await fetch("http://localhost:3000/user-classes", {
    method: "PUT",
    body: JSON.stringify({ classes }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update user data.");
  }

  return resData.message;
}
