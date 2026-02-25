import { jwtDecode } from "jwt-decode";

export type Role = "ADMIN" | "OPERATOR" | "VIEWER";

export interface User {
    id: string;
    username: string;
    name: string;
    role: Role;
}

interface DecodedToken {
    id: string;
    username: string;
    role: Role;
    name: string;
    exp: number;
}

export const getAuthToken = () => localStorage.getItem("access_token");
export const setAuthToken = (token: string) => localStorage.setItem("access_token", token);
export const removeAuthToken = () => localStorage.removeItem("access_token");

export const getUser = (): User | null => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            removeAuthToken();
            return null;
        }

        return {
            id: decoded.id,
            username: decoded.username,
            name: decoded.name,
            role: decoded.role,
        };
    } catch (error) {
        removeAuthToken();
        return null;
    }
};

export const logout = () => {
    removeAuthToken();
    window.location.href = "/login";
};

export const getRoleDefaultPath = (role: Role): string => {
    switch (role) {
        case "ADMIN":
            return "/admin/dashboard";
        case "OPERATOR":
            return "/ops/assets";
        case "VIEWER":
            return "/dashboard";
        default:
            return "/login";
    }
};
