import {fetchListSuccess,changeHeaderIndex} from './actions'
import {CHANGE_HEADER_INDEX} from './actionTypes'


const defaultState: HomeState = {
    headerIndex: 0
}

type actionType = ReturnType<typeof fetchListSuccess> & ReturnType<typeof changeHeaderIndex>



export default (state = defaultState, action: actionType) => {
    switch (action.type) {
        case CHANGE_HEADER_INDEX:{
            return {
                ...state,headerIndex:action.index
            }
        }
        
        default: {
            return state
        }
    }
}