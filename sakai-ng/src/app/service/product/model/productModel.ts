export interface ProductDto {
    id: number;
    code: string;
    name: string;
    image: string;
    price: number;
    categoryId: number;
    categoryName: string;
    saleType: boolean;
    value: number;
    isCombo: boolean;
    isTop: boolean;
    status: number;
    statusName: string;
}


export interface ProductCreateDto {
    id: number;
    code: string;
    name: string;
    description: string;
    image: string;
    categoryId: number;
    isCombo: boolean;
    isTop: boolean;
    productCombo?: ProductComboDto[],
    productPrice: ProductPriceDto[],
    status: number;
}

export interface ProductComboDto{
    id:number,
    productId : number,
    productRefId : number,
}


export interface ProductPriceDto {
    id: number;
    productId: number;
    price: number;
    startTime?: any;
    endTime?: any | null;
}
