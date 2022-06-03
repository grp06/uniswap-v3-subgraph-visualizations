import spinner from '../public/spinner.gif'
import Image from 'next/image'

const Loading = () => {
  return (
    <div className='loading-container'>
      <Image src={spinner} width={200} height={200} />
    </div>
  )
}

export default Loading
