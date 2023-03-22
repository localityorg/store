import { gql } from "@apollo/client";

// const PRODUCT_FRAGMENT = gql`
//   fragment ProductDetail on Product {
//     id
//     url
//     name
//     quantity {
//       count
//       type
//     }
//     price {
//       mrp
//       discount
//     }
//   }
// `;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($name: String!, $limit: Int!) {
    getProducts(name: $name, limit: $limit) {
      id
      name
      url
      barcode
      price {
        mrp
        discount
      }
      quantity {
        count
        type
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query getProduct($storeId: String!, $barcode: String!) {
    getProduct(storeId: $storeId, barcode: $barcode) {
      product {
        id
        name
        url
        barcode
        price {
          mrp
          discount
        }
        quantity {
          count
          type
        }
      }
      inStore
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation Mutation($product: ProductToInventoryInput) {
    editProduct(product: $product) {
      id
      name
      url
      price {
        mrp
        discount
      }
      quantity {
        count
        type
      }
    }
  }
`;
