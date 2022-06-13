export interface UserDto {
    id: number;
    fullName: string;
    userName: string;
    phone: string;
    email: string;
    address:string;
    birthday: string;
    identity: string;
    isActive: boolean;
    status: number;
    statusName: string;
}

export interface CreateUserRole {
    userId: number;
    roleId: number;
}

export interface UserRole {
    id: number;
    name: string;
    description: string;
    checked: boolean;
}


export interface PositionByUser {
    id: number;
    name: string;
    description: string;
    userPositionId: number;
    startTime: string;
    endTime: string | null;
}
