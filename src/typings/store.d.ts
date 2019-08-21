declare interface IDraftState {
    id: number,
    isChecked: boolean;
    content: string;
}

declare type IList = IDraftState[]

declare interface IStoreState {
 
    edit: IDraftState,
    list: IList
}



