import { MaterialDto } from "../../material/model/materialModel";

export interface ImportInvoiceDto {
    id: number;
    code: string;
    description: string;
    note: string;
    suppilerId: number;
    suppilerName: string;
    totalCost: number;
    createdTime: string;
    createdBy: number;
    createdByName: string;
    status: number;
    statusName: string;
}

export interface MaterialSelectDto{
    material : MaterialDto;
    stock : number;
    price: number;
    startTime : any;
    expriedTime : any;
}

export interface CreateImportInvoice {
    id: number;
    code: string;
    description: string;
    note: string;
    supplierId: number;
    status:number;
    importInvoiceDetails: ImportInvoiceDetail[];
}

export interface ImportInvoiceDetail {
    id: number;
    importInvoiceId: number;
    materialId: number;
    stock: number;
    price: number;
    startTime : any;
    expriedTime : any;
}
