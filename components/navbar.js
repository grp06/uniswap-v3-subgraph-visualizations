import { useState, useEffect } from 'react'

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(null)
  useEffect(() => {
    const tab = process?.title === 'browser' ? window.location.pathname : null
    setActiveTab(tab)
  }, [])

  return (
    <nav className='d-flex justify-content-center py-3light'>
      <ul className='nav nav-pills'>
        <li className='nav-item'>
          <a
            className={`nav-link ${activeTab === '/pools' ? 'active' : ''}`}
            href='/pools'
          >
            Pools
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={`nav-link ${activeTab === '/tokens' ? 'active' : ''}`}
            href='/tokens'
          >
            Tokens
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={`nav-link ${
              activeTab === '/transactions' ? 'active' : ''
            }`}
            href='/transactions'
          >
            Transactions
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
