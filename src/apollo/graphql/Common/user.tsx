import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($contact: ContactInput!) {
    login(contact: $contact) {
      id
      name
      token
      contact {
        ISD
        number
      }
    }
  }
`;
