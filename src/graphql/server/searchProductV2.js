import gql from "graphql-tag";

export const GET_HIGHEST_PRICE = gql`
  query GetHighestPrice($country: CountryCode!, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 1, sortKey: PRICE, reverse: true) {
      edges {
        node {
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_RESULTS = gql`
  query SearchResults(
    $searchText: String!
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $first: Int!
    $after: String
    $country: CountryCode!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(
      first: $first
      query: $searchText
      sortKey: $sortKey
      reverse: $reverse
      after: $after
      types: PRODUCT
    ) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ... on Product {
            id
            title
            availableForSale
            productType
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  originalSrc
                  transformedSrc
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  quantityAvailable
                  compareAtPriceV2 {
                    amount
                    currencyCode
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
