import { SET_INVENTORY } from "../actions";

var inventoryState = {
  id: null,
  inventory: [],
  change: [],
};

export function inventoryReducer(state = inventoryState, action: any) {
  switch (action.type) {
    case SET_INVENTORY:
      return {
        ...state,
        id: action.payload.id,
        inventory: action.payload.products,
      };
    default:
      return state;
  }
}
