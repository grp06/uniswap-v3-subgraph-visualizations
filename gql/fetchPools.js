import { gql } from '@apollo/client'

const FETCH_POOLS = gql`
  query fetchPools($orderBy: String, $orderDirection: String) {
    pools(orderBy: $orderBy, orderDirection: $orderDirection) {
      volumeUSD
    }
  }
`

export default FETCH_POOLS
