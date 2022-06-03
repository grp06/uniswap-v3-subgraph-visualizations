import { useLazyQuery } from '@apollo/client'
import FETCH_TOKENS from '../gql/fetchTokens'
import { useState, useEffect, useContext, useCallback } from 'react'
import {
  getTableHeader,
  numberWithCommas,
  getPrice,
  getPriceChange,
  oneDayAgo,
} from '../utils'
import { AppContext } from '../pages/_app'
import Loading from './Loading'

const Tokens = () => {
  const { setAppLoading, appLoading } = useContext(AppContext)
  const [orderBy, setOrderBy] = useState('totalValueLockedUSD')
  const [orderDirection, setOrderDirection] = useState('desc')
  const [fetchTokens, { error }] = useLazyQuery(FETCH_TOKENS)
  const [page, setPage] = useState(1)
  const [tokenData, setTokenData] = useState(null)

  const fetchTokensAsync = useCallback(
    async (nextPage, refetching) => {
      setAppLoading(true)
      const skip = nextPage ? (nextPage - 1) * 15 : 0
      const res = await fetchTokens({
        fetchPolicy: refetching ? 'network-only' : 'cache-first',
        variables: {
          orderBy,
          orderDirection,
          skip,
          dateFilter: oneDayAgo,
        },
      })
      setPage(nextPage || 1)
      setTokenData(res.data.tokens)
      setTimeout(() => {
        setAppLoading(false)
      }, 250)
    },
    [fetchTokens, orderBy, orderDirection, setAppLoading]
  )

  useEffect(() => {
    fetchTokensAsync()
  }, [orderBy, orderDirection, fetchTokens, fetchTokensAsync])

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

  if (appLoading) return <Loading />
  if (error) return `Error! ${error.message}`

  return (
    <>
      <nav className='top-nav'>
        <ul className='pagination'>
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <a className='page-link' onClick={() => fetchTokensAsync(page - 1)}>
              Previous
            </a>
          </li>

          <li className={`page-item ${!tokenData ? 'disabled' : ''}`}>
            <a className='page-link' onClick={() => fetchTokensAsync(page + 1)}>
              Next
            </a>
          </li>
        </ul>
        <ul>
          <li className='page-item'>
            <a
              className='page-link'
              onClick={() => fetchTokensAsync(null, true)}
            >
              Refresh
            </a>
          </li>
        </ul>
      </nav>
      <table className='table table-striped table-sm table-hover'>
        <thead className='table-dark'>
          <tr>
            <th className='token-heading'>Token</th>
            <th className='price-heading'>Price</th>
            <th className='price-change-heading'>Price Change (%)</th>
            {getTableHeader(
              'totalValueLockedUSD',
              orderBy,
              orderDirection,
              flipSort
            )}
            {getTableHeader('volumeUSD', orderBy, orderDirection, flipSort)}
            {getTableHeader('txCount', orderBy, orderDirection, flipSort)}
          </tr>
        </thead>
        <tbody>
          {tokenData.map((token, idx) => {
            return (
              <tr key={idx}>
                <td>{`${token.name} (${token.symbol})`} </td>
                <td>{getPrice(token)}</td>
                {getPriceChange(token)}
                <td>
                  {numberWithCommas(Math.round(token.totalValueLockedUSD))}
                </td>
                <td>{numberWithCommas(Math.round(token.volumeUSD))}</td>
                <td>{`${numberWithCommas(token.txCount)}`} </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Tokens
