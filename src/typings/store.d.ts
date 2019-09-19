declare interface IDraftState {
    id: number,
    isChecked: boolean;
    content: string;
}

declare type IList = IDraftState[]

declare interface HomeState{
    headerIndex:number;
}

declare interface IStoreState {
    home:HomeState,
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

//行情数据
declare interface Quote{
    px_change:number;
    px_change_rate:number;
    last_px:number;
    bid_grp?:string;
    offer_grp:string;
}


