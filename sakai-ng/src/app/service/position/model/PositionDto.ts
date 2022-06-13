import { UserDto } from "../../user/model/UserDto";

export interface PositionDto {
    id: number;
    name: string;
    description: string;
    parentId: number;
}

export interface PositionUserDto {
    id: number;
    fullName: string;
    userName: string;
    phone: string;
    email: string;
    userPositionId: number;
    positionId: number,
    startTime: string;
    endTime: string;
}

export interface CreatePositionUserDto {
    id: number;
    userId: number;
    positionId: number;
    startTime: any;
    endTime?: any;
}

export interface StaffSelected {
    user: UserDto;
    userPositionId: number;
    startTime: any;
    endTime: any;
}
export interface PositionDetailDto {
    postion: PositionDto;
    staffs: PositionUserDto[];
}
