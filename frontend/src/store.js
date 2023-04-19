import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'
import { productsReducer,productDetailsReducer} from './Reducers/productReducers';
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer
})

let intialState={}

const middleware = [thunk];
const store = createStore(reducer,intialState,composeWithDevTools(applyMiddleware(...middleware)));

export default store;

