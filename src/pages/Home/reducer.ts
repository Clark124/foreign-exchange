import {fetchListSuccess} from './actions'

const defaultState: IList = []

type actionType = ReturnType<typeof fetchListSuccess>

export default (state = defaultState, action: actionType) => {
    switch (action.type) {
       
        
        default: {
            return state
        }
    }
}