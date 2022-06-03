import { useRouter } from 'next/router'
import { useEffect } from 'react'

const RootComponent = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/pools')
  })
  return <div></div>
}

export default RootComponent
