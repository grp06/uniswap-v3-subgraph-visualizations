import { ApolloProvider } from '@apollo/client'
import Head from 'next/head'
import client from '../client'
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'
import Layout from '../components/layout'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createContext, useState } from 'react'

export const AppContext = createContext()

export default function MyApp({ Component, pageProps }) {
  const [appLoading, setAppLoading] = useState(true)
  return (
    <ApolloProvider client={client}>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap'
          rel='stylesheet'
        />
      </Head>
      <AppContext.Provider value={{ appLoading, setAppLoading }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    </ApolloProvider>
  )
}
