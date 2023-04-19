export class Result<dateType> {
  constructor(
    public isDone: boolean,
    public data: dateType = {} as dateType,
    public message: string,
    public links: LinksDTO,
    public meta: MetaDTO,
  ) {
  }
}
export interface MetaDTO {
  current_page: number,
  from: number,
  last_page: number,
  links: any[];
  path: string
  per_page: number
  to: number
  total: number
}
export interface LinksDTO {
  first: string;
  last: string;
  prev: string;
  next: string
}

