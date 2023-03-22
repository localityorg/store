import { gql } from "@apollo/client";

export const GET_ORDER = gql`
  query getOrder($id: String!) {
    getOrder(id: $id) {
      id
      products {
        name
        url
        quantity {
          units
          count
          type
        }
        totalAmount
      }
      state {
        message
        order {
          cancelled
          accepted
          date
        }
        delivery {
          delivered
          deliveredAt
          dispatched
          dispatchedAt
          address {
            line
            location {
              coordinates
            }
          }
          deliverBy
        }
        payment {
          paid
          grandAmount
        }
        created {
          date
        }
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query FetchOrders($limit: Int!, $offset: Int!) {
    getOrders(limit: $limit, offset: $offset) {
      id
      products {
        name
        url
        quantity {
          units
          count
          type
        }
        totalAmount
      }
      state {
        message
        order {
          cancelled
          accepted
          date
        }
        delivery {
          delivered
          deliveredAt
          dispatched
          dispatchedAt
          address {
            line
            location {
              coordinates
            }
          }
          deliverBy
        }
        payment {
          paid
          grandAmount
        }
        created {
          date
        }
      }
    }
  }
`;

export const GET_NEW_ORDER = gql`
  subscription Subscription($id: String!) {
    orderUpdate(id: $id) {
      id
      products {
        name
        url
        quantity {
          units
          count
          type
        }
        totalAmount
      }
      state {
        message
        order {
          cancelled
          accepted
          date
        }
        delivery {
          delivered
          deliveredAt
          dispatched
          dispatchedAt
          address {
            line
            location {
              coordinates
            }
          }
          deliverBy
        }
        payment {
          paid
          grandAmount
        }
        created {
          date
        }
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation createOrder($orderInfo: OrderInfo) {
    createOrder(orderInfo: $orderInfo) {
      id
    }
  }
`;

export const ALTER_STATE = gql`
  mutation alterOrderState($id: String!, $accepted: Boolean!) {
    alterOrderState(id: $id, accepted: $accepted)
  }
`;

export const DISPATCH_ORDER = gql`
  mutation DispatchOrder($id: String!) {
    dispatchOrder(id: $id)
  }
`;

export const DELIVER_ORDER = gql`
  mutation DeliverOrder($id: String!, $coordinates: [String]!) {
    deliverOrder(id: $id, coordinates: $coordinates)
  }
`;

export const ORDER_PAID = gql`
  mutation PaidOrder($id: String!, $method: String!) {
    paymentStatus(id: $id, method: $method)
  }
`;
