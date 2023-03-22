import { SET_RUNNING_ACCOUNTS, SET_ACCOUNTS_META } from "../actions";

var accountState = {
  accounts: [],
  totalPending: {
    count: 0,
    amount: "0",
  },
};

export function accountsReducer(state = accountState, action: any) {
  switch (action.type) {
    case SET_RUNNING_ACCOUNTS:
      return { ...state, accounts: action.payload };
    case SET_ACCOUNTS_META:
      return {
        ...state,
        totalPending: {
          count: action.payload.count,
          amount: action.payload.amount,
        },
      };
    default:
      return state;
  }
}
