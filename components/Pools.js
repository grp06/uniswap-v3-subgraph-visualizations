import { useLazyQuery } from '@apollo/client'
import FETCH_POOLS from '../gql/fetchPools'
import { useState, useEffect, useContext, useCallback } from 'react'
import { getTableHeader, numberWithCommas } from '../utils'
import { AppContext } from '../pages/_app'
import Loading from './Loading'

const Pools = () => {
  const { setAppLoading, appLoading } = useContext(AppContext)
  const [orderBy, setOrderBy] = useState('totalValueLockedUSD')
  const [orderDirection, setOrderDirection] = useState('desc')
  const [fetchPools, { error }] = useLazyQuery(FETCH_POOLS)
  const [page, setPage] = useState(1)
  const [poolData, setPoolData] = useState(null)

  const fetchPoolsAsync = useCallback(
    async (nextPage, refetching) => {
      setAppLoading(true)
      // if we're calling this function when clicking "next page" skip 15 results * current page
      // otherwise, we're calling it when the page loads
      const skip = nextPage ? (nextPage - 1) * 15 : 0
      const res = await fetchPools({
        fetchPolicy: refetching ? 'network-only' : 'cache-first',
        variables: {
          orderBy,
          orderDirection,
          skip,
        },
      })
      setPage(nextPage || 1)
      setPoolData(res.data.pools)
      // give a ltitle delay so when the network is super fast it doesn't feel jarring
      setTimeout(() => {
        setAppLoading(false)
      }, 250)
    },
    [fetchPools, orderBy, orderDirection, setAppLoading]
  )

  useEffect(() => {
    fetchPoolsAsync()
  }, [orderBy, orderDirection, fetchPoolsAsync])

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
            <a className='page-link' onClick={() => fetchPoolsAsync(page - 1)}>
              Previous
            </a>
          </li>

          <li className={`page-item ${!poolData ? 'disabled' : ''}`}>
            <a className='page-link' onClick={() => fetchPoolsAsync(page + 1)}>
              Next
            </a>
          </li>
        </ul>
        <ul>
          <li className='page-item'>
            <a
              className='page-link'
              onClick={() => fetchPoolsAsync(null, true)}
            >
              Refresh
            </a>
          </li>
        </ul>
      </nav>
      <table className='table table-striped table-sm table-hover'>
        <thead className='table-dark'>
          <tr>
            <th>Trading Pair </th>
            {getTableHeader(
              'totalValueLockedUSD',
              orderBy,
              orderDirection,
              flipSort
            )}
            {getTableHeader('volumeUSD', orderBy, orderDirection, flipSort)}
          </tr>
        </thead>
        <tbody>
          {poolData.map((pool, idx) => {
            return (
              <tr key={idx}>
                <td>{`${pool.token0.symbol} / ${pool.token1.symbol}`} </td>
                <td>
                  {numberWithCommas(Math.round(pool.totalValueLockedUSD))}
                </td>
                <td>{numberWithCommas(Math.round(pool.volumeUSD))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Pools
