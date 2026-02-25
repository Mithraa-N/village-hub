export enum Role {
    ADMIN = "ADMIN",
    OPERATOR = "OPERATOR",
    VIEWER = "VIEWER",
}

export interface UserPayload {
    id: string;
    username: string;
    role: Role;
    name: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
