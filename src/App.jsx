import CalculatorBuilder from './components/CalculatorBuilder'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <CalculatorBuilder />
      <Toaster position="top-right" />
    </>
  )
}

export default App
