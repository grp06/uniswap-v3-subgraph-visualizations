import { gql } from '@apollo/client'

const FETCH_POOLS = gql`
  query fetchPools($orderBy: String, $orderDirection: String, $skip: Int) {
    pools(
      orderBy: $orderBy
      orderDirection: $orderDirection
      skip: $skip
      first: 15
    ) {
      totalValueLockedUSD
      volumeUSD
      token0 {
        symbol
        name
      }
      token1 {
        symbol
        name
      }
    }
  }
`

export default FETCH_POOLS
