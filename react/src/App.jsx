import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InputCom from './pages/customHook/index'
import LineCom from './pages/lineChart/index'
import MoreCom from './pages/moreReport/index'
import MList from './pages/virtualReport/index'
import RMList from './pages/virtualReport/rIndex'
// import G2Com from './pages/antv/com'
import S2Com from './pages/antv/g2com'
import WorkerCom from './pages/worker/index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      <InputCom/>

      {/* <LineCom /> */}

      {/* <MoreCom/> */}

      {/* <MList/> */}

      {/* <RMList/> */}

      {/* <G2Com/> */}

      {/* <S2Com/> */}

      <WorkerCom/>
    </>
  )
}

export default App
