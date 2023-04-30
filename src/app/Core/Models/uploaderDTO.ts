
export interface fileObjDTO {
    size: number;
    name: string;
    type: string;
    path: string;
    url: string;

}

export interface fileListResDTO {
    current_path: string;
    files: fileObjDTO[];
    directories: string[];
}