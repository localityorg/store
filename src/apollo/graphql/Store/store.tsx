import { gql } from "@apollo/client";

export const GET_STORE = gql`
  query GetStore {
    getStore {
      id
      name
      stat {
        amount
        count
        error
        errorMessage
      }
      meta {
        closed
        verified
      }
      address {
        line
        location {
          coordinates
        }
      }
    }
  }
`;

export const GET_STORE_ACCOUNTS = gql`
  query GetStoreAccounts {
    getStore {
      id
      name
      stat {
        amount
        count
        error
        errorMessage
      }
      meta {
        closed
        verified
      }
      address {
        line
        location {
          coordinates
        }
      }
    }
  }
`;

export const EDIT_STORE = gql`
  mutation Mutation($edit: Boolean!, $storeInfo: StoreInfo) {
    editStore(edit: $edit, storeInfo: $storeInfo) {
      id
      name
      stat {
        amount
        count
        error
        errorMessage
      }
      meta {
        closed
        verified
      }
      address {
        line
        location {
          coordinates
        }
      }
      token
      refreshToken
    }
  }
`;
export const STORE_UPDATE = gql`
  subscription StoreUpdate($id: String!) {
    storeUpdate(id: $id) {
      id
      name
      stat {
        amount
        count
        error
        errorMessage
      }
      meta {
        closed
        verified
      }
      address {
        line
        location {
          coordinates
        }
      }
    }
  }
`;
