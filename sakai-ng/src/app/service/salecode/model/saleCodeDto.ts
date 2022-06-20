export interface SaleCodeDto {
    id: number;
    name: string;
    code: string;
    saleType: boolean;
    value: number;
    stock: number;
    stockByUser: number;
    minPrice: number;
    maxPriceSale: number;
    startTime: string;
    endTime: string;
    createdTime: string;
    updatedTime: string;
    createdBy: number;
    createdByName: string;
    updatedBy: number;
    updatedByName: string;
    status: number;
    statusName: string;
}

export interface CreateSaleCodeDto {
    id: number;
    name: string;
    code: string;
    saleType: boolean;
    value: number;
    stock: number;
    stockByUser: number;
    minPrice: number;
    maxPriceSale:number;
    startTime: string;
    endTime: string;
    status: number;
}

