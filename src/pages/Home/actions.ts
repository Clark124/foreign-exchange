import {FETCH_LIST_SUCCESS} from './actionTypes'

export const fetchListSuccess = (value:IList)=>({
    type: FETCH_LIST_SUCCESS,
    value
})