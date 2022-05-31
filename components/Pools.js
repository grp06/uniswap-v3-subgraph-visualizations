import { useLazyQuery } from '@apollo/client'
import FETCH_POOLS from '../gql/fetchPools'
import { useState, useEffect } from 'react'

const Pools = () => {
  const [orderBy, setOrderBy] = useState('volumeUSD')
  const [orderDirection, setOrderDirection] = useState('desc')
  const [pools, setPools] = useState(null)
  const [getPools, { loading, error, data }] = useLazyQuery(FETCH_POOLS)

  useEffect(() => {
    const go = async () => {
      const res = await getPools({
        variables: {
          orderBy,
          orderDirection,
        },
      })
      setPools(res.data.pools)
    }
    go()
  }, [])

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <div>
      <div>hey</div>
    </div>
  )
}

export default Pools
