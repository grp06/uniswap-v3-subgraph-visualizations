import { gql } from '@apollo/client'

const FETCH_TRANSACTIONS = gql`
  query fetchTransactions(
    $orderBy: String
    $orderDirection: String
    $skip: Int
  ) {
    swaps(
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: 15
      skip: $skip
    ) {
      amount0
      amount1
      sender
      recipient
      amountUSD
      timestamp
      token0 {
        symbol
      }
      token1 {
        symbol
      }
    }
  }
`

export default FETCH_TRANSACTIONS
