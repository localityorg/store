import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { locationReducer, userReducer } from "./Common/reducers";

import { cartReducer } from "./Store/reducers/cart";
import { ordersReducer } from "./Store/reducers/orders";
import { storeReducer } from "./Store/reducers/store";
import { accountsReducer } from "./Store/reducers/accounts";
import { inventoryReducer } from "./Store/reducers/inventory";
// import {deliveryReducer} from './Retail/reducers/delivery';

const rootReducer = combineReducers({
  cartReducer,
  userReducer,
  locationReducer,
  storeReducer,
  ordersReducer,
  // deliveryReducer,
  accountsReducer,
  inventoryReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
