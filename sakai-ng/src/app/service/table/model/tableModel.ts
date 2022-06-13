/**
 * Lấy ra list column của table
 */
export interface SystemTableColumn {
    id: number;
    tableId: string;
    columnName: string;
    sqlColumnName: string;
    sqlAlias: string;
    columnHeader: string;
    dataTypeId: number;
    queryData: string;
    isShow: boolean;
    isFilter: boolean;
    order: number;
    isDeleted: boolean;
}
export interface SelectBoxDataDto {
    id: number;
    name: number;
}

export interface SystemTableColumnDto extends SystemTableColumn{
    selectBoxData : SelectBoxDataDto[],
    value:any
}

// base query data
export interface BaseParamModel {
    tableConfigName: string;
    filterString?: string;
    pageNumber: number;
    pageSize: number;
    sortBy?: number;
    isAsc?: boolean;
    filterColumns?: FilterColumn[];
}

// base filter
export interface FilterColumn {
    columnId: number;
    value: string;
}

export interface ListResult<T> {
    result: T[];
    count: number;
}
