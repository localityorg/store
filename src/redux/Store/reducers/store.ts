import { SET_STORE, REMOVE_STORE } from "../actions";

var storeState = {
  store: null,
};

export function storeReducer(state = storeState, action: any) {
  switch (action.type) {
    case SET_STORE:
      return { ...state, store: action.payload };
    case REMOVE_STORE:
      return { ...state, store: null };
    default:
      return state;
  }
}
