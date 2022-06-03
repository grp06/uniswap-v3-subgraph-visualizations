import Navbar from './navbar'

const Layout = ({ children }) => {
  return (
    <div className='container'>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default Layout
