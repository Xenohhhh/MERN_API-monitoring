export const getStoredToken = () => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  return token;
};

export const storeToken = (token) => {
  if (!token) {
    localStorage.removeItem("token");
    return false;
  }

  localStorage.setItem("token", token);
  return true;
};

export const clearToken = () => {
  localStorage.removeItem("token");
};
