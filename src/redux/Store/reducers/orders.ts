import { OrderProps } from "../../../components/Store/OrderCard";
import { CHANGE_STATE, SET_ORDERS } from "../actions";

var orderState = {
  orders: [],
  pending: [],
  lastOrder: null,
};

function stackPendingOrders(orders: Array<OrderProps>) {
  var stack = [...orders];

  var pending = orders.filter(
    (order: any) => order.state.order.accepted === false
  );

  pending.forEach((order: OrderProps) => {
    const index = stack.findIndex((o: any) => o.id === order.id);
    stack.splice(index, 1);
  });

  return [...pending, ...stack];
}

export function ordersReducer(state: any = orderState, action: any) {
  switch (action.type) {
    case SET_ORDERS:
      return { ...state, orders: stackPendingOrders(action.payload) };
    case CHANGE_STATE:
      if (!action.payload.accept) {
        var updated = state.orders.filter(
          (order: any) => order.id !== action.payload.id
        );
        return { ...state, orders: updated };
      } else {
        return state;
      }
    default:
      return state;
  }
}
