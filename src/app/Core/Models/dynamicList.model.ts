export interface IListProps {
    name: string;
    col: string;
    type: string
    label: string;
}

export interface IListEmptyBox {
    text: string;
    icon: string;
}

export interface IListButtons {
    name: string;
    label: string;
    link: string;
    isLink: boolean;
    show: boolean;
    showDD?: boolean;
    permission: string
    icon: string;
    style: string;
    data?: any
    children: IListButtons[]
}

export interface IListFilters {
    data: any;
    label: string;
    type: string;
    value: any;
    key?: string;
    reqKey: string;
    keyValue?: string;
    keyOption?: string;
}

export interface IListModel {
    props: IListProps[];
    data: any;
    buttons: IListButtons[];
    filterMode: string;
    filters: IListFilters[]
    label: string;
    isTrash: boolean;
    showTrash: boolean;
    emptyBox: IListEmptyBox;
    rowButtons: IListButtons[]
    pagination: {
        pageNumber: number;
        meta: any;
        confiq: any
    }
}
