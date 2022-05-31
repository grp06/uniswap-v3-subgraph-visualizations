import { gql, ApolloProvider } from '@apollo/client'
import Head from 'next/head'
import client from '../client'

import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        pools(orderBy: volumeUSD, orderDirection: desc) {
          volumeUSD
        }
      }
    `,
  })

  return {
    props: {
      data,
    },
  }
}
