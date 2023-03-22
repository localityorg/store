import { gql } from "@apollo/client";

export const FETCH_INVENTORY = gql`
  query GetInventory {
    getInventory {
      id
      products {
        id
        quantity {
          units
          count
          type
        }
        url
        barcode
        price {
          mrp
        }
        name
      }
    }
  }
`;

export const ADD_INVENTORY = gql`
  mutation AddToInventory($products: [ProductToInventoryInput]) {
    addToInventory(products: $products)
  }
`;

export const INVENTORY_UPDATE = gql`
  subscription InventoryUpdate($id: String!) {
    inventoryUpdate(id: $id) {
      id
      products {
        id
        quantity {
          units
          count
          type
        }
        url
        barcode
        price {
          mrp
        }
        name
      }
    }
  }
`;
