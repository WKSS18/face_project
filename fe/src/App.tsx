import { useState } from 'react'
import { Button } from '@face-project/ui'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button variant="primary" onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> or <code>component-library</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        <Button variant="outline" size="sm">Outline</Button>
        {' '}
        <Button variant="secondary" size="lg">Secondary</Button>
      </p>
    </>
  )
}

export default App
