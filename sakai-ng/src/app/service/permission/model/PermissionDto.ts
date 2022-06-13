export interface RoleDto {
    id: number;
    name: string;
    description: string;
    isDefault: boolean;
}

export interface PermissionDto {
    roleId: number;
    permissionId: number;
    name: string;
    description: string;
    parentId: number;
    checked: boolean;
}

export interface CreatePermissionRole {
    roleId: number;
    permissonId: number;
}
