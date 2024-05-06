import { getAuthToken } from "./util/auth";

export async function fetchAvailableClasses() {
  const response = await fetch("http://localhost:3000/classes");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch classes.");
  }
  //console.log(resData[0])
  return resData;
}

export async function fetchUserClasses() {
  const response = await fetch("http://localhost:3000/user-classes");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch user classes");
  }

  return resData.classes;
}

export async function addUserClass(classId) {
  const token = getAuthToken();
  console.log(token)
  const response = await fetch("http://localhost:3000/enroll", {
    method: "POST",
    body: JSON.stringify({ "classId": classId }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update user data.");
  }

  return resData.message;
}
