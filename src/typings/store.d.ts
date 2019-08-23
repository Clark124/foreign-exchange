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

//单个K线数据
declare interface KLineData {
    close: number;
    high:number;
    low: number;
    open:number;
    date: number;
    volume: number;
}

//K线数据列
declare type KLineDataList = KLineData[]


