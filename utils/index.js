const oneDayInSeconds = 86400
const oneDayAgo = Math.round(Date.now() / 1000) - oneDayInSeconds

const getLabel = (value) => {
  switch (value) {
    case 'totalValueLockedUSD':
      return 'Total Value Locked'
    case 'volumeUSD':
      return 'Volume'
    case 'txCount':
      return 'Transactions'
    case 'amountUSD':
      return 'Total Value'
    case 'timestamp':
      return 'Time'
    default:
      break
  }
}

// utility to dispay an up or down icon depending on the table sort
// also makes the active header bold
const getTableHeader = (value, orderBy, orderDirection, flipSort) => {
  return (
    <th className={`${value} ${value === orderBy ? 'bold' : ''}`}>
      {getLabel(value)}
      {orderBy === value && orderDirection === 'desc' ? (
        <i className='bi bi-arrow-down' onClick={() => flipSort(value)}></i>
      ) : (
        <i className='bi bi-arrow-up' onClick={() => flipSort(value)}></i>
      )}
    </th>
  )
}

// just adds commas to big numbers 123,456,789
const numberWithCommas = (n) => {
  return n.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

// long ETH addresses make the table ugly
const shortenAddress = (address) => {
  return address.substr(0, 16).concat('...')
}

const getPrice = (token) => {
  const price = Number(token.tokenDayData[0]?.priceUSD).toFixed(2)
  if (isNaN(price)) return '-'
  return `$${price}`
}

const getPriceChange = (token) => {
  if (!token.tokenDayData.length) {
    return <td>-</td>
  }
  const { open, priceUSD } = token.tokenDayData[0]
  const pctChange = ((Number(priceUSD) - Number(open)) / Number(open)) * 100
  const getPriceClass = () => {
    if (pctChange > 0) {
      return 'green-text'
    } else if (pctChange < 0) {
      return 'red-text'
    }
  }
  return (
    <td className={`price-change-col ${getPriceClass()}`}>
      {!priceUSD
        ? ''
        : (((Number(priceUSD) - Number(open)) / Number(open)) * 100).toFixed(2)}
    </td>
  )
}

export {
  getTableHeader,
  numberWithCommas,
  getPrice,
  getPriceChange,
  oneDayAgo,
  shortenAddress,
}
