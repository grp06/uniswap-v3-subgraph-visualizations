import { gql } from '@apollo/client'

const FETCH_TOKENS = gql`
  query fetchTokens(
    $orderBy: String
    $orderDirection: String
    $skip: Int
    $dateFilter: Int
  ) {
    tokens(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: 15
      skip: $skip
    ) {
      id
      name
      symbol
      txCount
      volumeUSD
      totalValueLockedUSD
      tokenDayData(where: { date_gt: $dateFilter, date_not: null }) {
        date
        open
        priceUSD
      }
    }
  }
`

export default FETCH_TOKENS
