import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen w-screen flex items-center justify-center capitalize text-white bg-gradient-to-br from-slate-950 to-black'>
      {/* <img src="./matrix.svg" className='absolute grayscale max-w-screen max-h-screen z-0' /> */}

      <div className='size-60 bg-gradient-to-tr from-blue-800 to-transparent rounded-full blur-3xl absolute opacity-30' />

      <div className='border border-gray-950 p-8 rounded-3xl min-w-[30%] bg-gradient-to-br from-black backdrop-blur-xl'>
        <div className='flex items-center'>
          <span class="material-symbols-rounded">
            wallet
          </span>
          <h1 className='ml-6 text-3xl'>Wallet</h1>
        </div>

        <div className='flex justify-between text-2xl text-center my-8'>
          <button className='text-yellow-300  border border-gray-950  hover:bg-gray-950 py-2 p-4 rounded-l-lg flex flex-1 justify-center'>Deposit</button>
          <button className='border border-gray-950 hover:bg-gray-950 py-2 p-4 rounded-r-lg flex flex-1 justify-center'>Withdraw</button>
        </div>


        <div className='flex justify-between items-center'>
         <img className='w-10' src='https://seeklogo.com/images/B/binance-smart-chain-bsc-logo-9C34053D61-seeklogo.com.png' />
         <h1 className='ml-6 text-3xl'>BNB</h1>
          <div className='flex flex-col items-end'>
            <input className='bg-transparent outline-none text-4xl text-right text-white placeholder:text-white' placeholder='100'
              onChange={(_) => {
                if (typeof _ !== 'number') return
              }}
            />
            <p>21354</p>
          </div>
        </div>


      </div>

    </div>
  )
}

export default App
