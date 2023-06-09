import {ALL_PRODUCTS_FAIL,ALL_PRODUCTS_SUCCESS,ALL_PRODUCTS_REQUEST, CLEAR_ERRORS,
    PRODUCT_DETAILS_REQUEST,PRODUCT_DETAILS_SUCCESS,PRODUCT_DETAILS_FAIL
} from "../constants/productsConstants";

export const productsReducer = (state={products:[]},action)=>{
    switch(action.type){
        case ALL_PRODUCTS_REQUEST: return{
            loading: true,
            products:[]
        }

        case ALL_PRODUCTS_SUCCESS: return{
            loading:false,
            products:action.payload.products,
            productsCount: action.payload.productsCount,
            productsPerPage:action.payload.productsPerPage,
            filteredProductsCount: action.payload.filteredProductsCount
        }

        case ALL_PRODUCTS_FAIL: return{
            loading:false,
            error:action.payload
        }

        case CLEAR_ERRORS: return{
            ...state,
            error:null 
        }

        default: return state;
    }
}

export const productDetailsReducer = (state={product:{}},action)=>{
    switch(action.type){
        case PRODUCT_DETAILS_REQUEST: return{
            loading:true,
            ...state
        }
        case PRODUCT_DETAILS_SUCCESS: return{
            loding: false,
            product:action.payload,
        }
        case PRODUCT_DETAILS_FAIL: return{
            ...state,
            error:action.payload
        }
        case CLEAR_ERRORS: return{
            ...state,
            error:null 
        }
        default: return state;

    }
     
}