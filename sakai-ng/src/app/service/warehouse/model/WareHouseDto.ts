export interface WareHouseDto {
    id: number;
    materialCode: string;
    materialName: string;
    unitName: string;
    stock: number;
}

export interface MaterialDetailWareHouse {
    id: number;
    materialId: number;
    code: string;
    stock: number;
    startTime: string;
    expriedTime: string;
}

export interface GetWareHouse {
    materialId: number;
    skip: number;
    take: number;
}

/**
 * Object chọn
 */
export interface WarehouseSelect extends WareHouseDto{
    detail : MaterialDetailWareHouse[];
}



 // xuất kho
export interface ExportInvoiceDto {
    id: number;
    code: string;
    description: string;
    note: string;
    exportTo: number;
    exportToName: string;
    createdTime: string;
    createdBy: number;
    createdByName: string;
    status: number;
    statusName: string;
}

export interface ExportInvoiceDetailDto {
    id: number;
    exportInvoiceId: number;
    warehouseId: number;
    materialId: number;
    materialCode?: string;
    materialName?: string;
    stock: number;
    stockInWarehouse?: number;
}

export interface CreateExportInvoiceDto {
    id: number;
    code: string;
    description: string;
    note: string;
    exportTo: number;
    exportInvoiceDetails: ExportInvoiceDetailDto[];
}
