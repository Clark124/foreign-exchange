import {FETCH_LIST_SUCCESS,CHANGE_HEADER_INDEX} from './actionTypes'

export const fetchListSuccess = (value:IList)=>({
    type: FETCH_LIST_SUCCESS,
    value
})

export const changeHeaderIndex = (index:number) => ({
    type: CHANGE_HEADER_INDEX,
    index
})