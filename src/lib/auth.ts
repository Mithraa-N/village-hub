export type Role = "ADMIN" | "OPERATOR" | "VIEWER";

export interface User {
    id: string;
    username: string;
    name: string;
    role: Role;
}

export const getAuthToken = () => localStorage.getItem("access_token");
export const setAuthToken = (token: string) => localStorage.getItem("access_token") ? localStorage.setItem("access_token", token) : localStorage.setItem("access_token", token);
export const removeAuthToken = () => localStorage.removeItem("access_token");

export const getUser = (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const setUser = (user: User) => localStorage.setItem("user", JSON.stringify(user));
export const removeUser = () => localStorage.removeItem("user");

export const logout = () => {
    removeAuthToken();
    removeUser();
};
