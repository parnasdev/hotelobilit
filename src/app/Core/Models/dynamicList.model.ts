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
    link: string;
    isLink: boolean;
    show: boolean
    permission: string
    icon: string;
    style: string;
    children: IListButtons[]
}

export interface IListFilters {
    data: any;
    label: string;
    type: string;
    value: any;
    key:string,
  reqKey:string
}

export interface IListModel {
    props: IListProps[];
    data: any;
    buttons: IListButtons[];
    filters: IListFilters[]
    label: string;
    isTrash:boolean;
    showTrash:boolean;
    emptyBox: IListEmptyBox;
    rowButtons: IListButtons[]
    pagination: {
        pageNumber: number;
        meta: any;
        confiq: any
    }
}
