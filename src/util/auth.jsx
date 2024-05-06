export function getAuthToken() {
  try {
    const token = localStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;  // Ensure function returns even on error
  }
}