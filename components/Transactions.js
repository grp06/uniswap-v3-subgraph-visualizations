import moment from 'moment'
import { useLazyQuery } from '@apollo/client'
import FETCH_TRANSACTIONS from '../gql/fetchTransactions'
import { useState, useEffect, useContext, useCallback } from 'react'
import {
  getTableHeader,
  numberWithCommas,
  oneDayAgo,
  shortenAddress,
} from '../utils'
import { AppContext } from '../pages/_app'
import Loading from './Loading'

const Transactions = () => {
  const { setAppLoading, appLoading } = useContext(AppContext)
  const [orderBy, setOrderBy] = useState('timestamp')
  const [orderDirection, setOrderDirection] = useState('desc')
  const [fetchTransactions, { error }] = useLazyQuery(FETCH_TRANSACTIONS)
  const [page, setPage] = useState(1)
  const [transactionData, setTransactionData] = useState(null)

  const fetchTransactionsAsync = useCallback(
    async (nextPage, refetching) => {
      const skip = nextPage ? (nextPage - 1) * 15 : 0
      setAppLoading(true)
      const res = await fetchTransactions({
        fetchPolicy: refetching ? 'network-only' : 'cache-first',
        variables: {
          orderBy,
          orderDirection,
          skip,
          dateFilter: oneDayAgo,
        },
      })
      setPage(nextPage || 1)
      setTransactionData(res.data.swaps)
      setTimeout(() => {
        setAppLoading(false)
      }, 250)
    },
    [fetchTransactions, orderBy, orderDirection, setAppLoading]
  )

  useEffect(() => {
    fetchTransactionsAsync()
  }, [orderBy, orderDirection, fetchTransactions, fetchTransactionsAsync])

  const flipSort = (column) => {
    if (column !== orderBy) {
      return setOrderBy(column)
    }
    if (orderDirection === 'desc') {
      setOrderDirection('asc')
    } else {
      setOrderDirection('desc')
    }
  }

  if (appLoading || !transactionData) return <Loading />
  if (error) return `Error! ${error.message}`

  return (
    <>
      <nav className='top-nav'>
        <ul className='pagination'>
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <a
              className='page-link'
              onClick={() => fetchTransactionsAsync(page - 1)}
            >
              Previous
            </a>
          </li>

          <li className={`page-item ${!transactionData ? 'disabled' : ''}`}>
            <a
              className='page-link'
              onClick={() => fetchTransactionsAsync(page + 1)}
            >
              Next
            </a>
          </li>
        </ul>
        <ul>
          <li className='page-item'>
            <a
              className='page-link'
              onClick={() => fetchTransactionsAsync(null, true)}
            >
              Refresh
            </a>
          </li>
        </ul>
      </nav>
      <table className='table table-striped table-sm table-hover'>
        <thead className='table-dark'>
          <tr>
            {getTableHeader('timestamp', orderBy, orderDirection, flipSort)}
            {getTableHeader('amountUSD', orderBy, orderDirection, flipSort)}
            <th>Token 1</th>
            <th>Token 2</th>
            <th>Recipient</th>
            <th>Sender</th>
          </tr>
        </thead>
        <tbody>
          {transactionData.map((transaction, idx) => {
            const {
              amount0,
              amount1,
              sender,
              recipient,
              timestamp,
              amountUSD,
              token0,
              token1,
            } = transaction
            return (
              <tr key={idx}>
                <td>{moment(timestamp * 1000).fromNow()}</td>
                <td>$ {numberWithCommas(Math.round(amountUSD))}</td>
                <td>
                  {numberWithCommas(Math.abs(amount0).toFixed(2))}{' '}
                  {token0.symbol}
                </td>
                <td>
                  {numberWithCommas(Math.abs(amount1).toFixed(2))}{' '}
                  {token1.symbol}
                </td>
                <td>
                  <a href={`https://etherscan.io/address/${sender}`}>
                    {shortenAddress(sender)}
                  </a>
                </td>
                <td>
                  <a href={`https://etherscan.io/address/${recipient}`}>
                    {shortenAddress(recipient)}
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Transactions
