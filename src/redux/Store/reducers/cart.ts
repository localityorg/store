import { ProductProps } from "../../../components/Store/OrderCard";
import { ADD_CART_ITEM, REMOVE_CART_ITEM, EMPTY_CART } from "../actions";

var cartState: {
  cart: Array<ProductProps>;
} = {
  cart: [],
};

function operate(item: ProductProps, cart: Array<ProductProps>, add: boolean) {
  let arr = [...cart];
  let i: number = arr.findIndex((p) => p.id === item.id);

  if (i <= -1) {
    if (add) {
      arr.push({
        ...item,
        quantity: { ...item.quantity, units: 1 },
        totalAmount: item.price.mrp,
      });
    }
  } else {
    if (add) {
      let units = cart[i].quantity.units + 1;
      arr[i] = {
        ...cart[i],
        quantity: { ...cart[i].quantity, units },
        totalAmount: (parseFloat(item.price.mrp) * units).toString(),
      };
    } else {
      let units = cart[i].quantity.units - 1;
      if (units <= 0) {
        arr.splice(i, 1);
      } else {
        arr[i] = {
          ...cart[i],
          quantity: { ...cart[i].quantity, units: units },
          totalAmount: (parseFloat(item.price.mrp) * units).toString(),
        };
      }
    }
  }
  return arr;
}

export function cartReducer(state: any = cartState, action: any) {
  switch (action.type) {
    case ADD_CART_ITEM:
      const n = operate(action.payload, state.cart, true);
      return { ...state, cart: n };
    case REMOVE_CART_ITEM:
      const m = operate(action.payload, state.cart, false);
      return { ...state, cart: m };
    case EMPTY_CART:
      return { ...state, cart: [] };
    default:
      return state;
  }
}
