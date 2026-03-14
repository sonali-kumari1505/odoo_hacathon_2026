// Mock user database stored in localStorage
interface User {
  loginId: string;
  email: string;
  password: string;
  fullName: string;
}

const USERS_KEY = "auth_users";

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByLoginId = (loginId: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.loginId === loginId);
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.email === email);
};

export const authenticateUser = (
  loginId: string,
  password: string
): User | null => {
  const user = findUserByLoginId(loginId);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem("current_user", JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("current_user");
  return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.removeItem("current_user");
};

export const validateLoginId = (loginId: string): string | null => {
  if (loginId.length < 6 || loginId.length > 12) {
    return "Login ID must be between 6-12 characters";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(loginId)) {
    return "Login ID can only contain letters, numbers, and underscores";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};
