import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import immutable from 'redux-immutable-state-invariant'
import { composeWithDevTools } from 'redux-devtools-extension'

import { createHashHistory } from 'history'

import homeReducer from './pages/Home/reducer'


const history = createHashHistory()

const reducer = combineReducers({
    home: homeReducer,
})

const middlewares = [thunkMiddleware,routerMiddleware(history)];
if (process.env.NODE_ENV !== 'production') {
    middlewares.push(immutable())
}

const storeEnhancers = process.env.NODE_ENV !== 'production' ?
    composeWithDevTools(
        applyMiddleware(...middlewares),
    ) :
    applyMiddleware(...middlewares);

const store = createStore(reducer, {}, storeEnhancers);

export {
    store
}