import { UserType } from "./UserType";

export interface User {
    id: string;
    name: string;
    type: UserType,
}
