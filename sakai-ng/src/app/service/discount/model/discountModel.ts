export interface DiscountDto {
    id: number;
    code: string;
    name: string;
    saleType: boolean
    value: number
    startTime: any;
    endTime: any;
    status: number;
    statusName:string;
}

export interface CreateDiscountDto{
    id: number;
    code: string;
    name: string;
    saleType: boolean
    value: number
    startTime: any;
    endTime: any;
    status: number;
    productDiscount: number[];
}

export interface DiscountProductDto{
    id: number;
    discountId: number;
    productId: number;
}

export interface GetDetailDiscount extends DiscountDto {
    listProduct: number[];
}
