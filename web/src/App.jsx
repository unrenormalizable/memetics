import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import * as P from './pages'
import * as C from './components'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

/*
  Structure
  v Layout
  v Search event hooked up
  v loader spinners (swr)
  v errors (react-error-boundary)
  Enhancements
  v Kbd only navigation + hints (react-hotkeys-hook)
  v mobile
  v deep link
  x image component placeholders
  x Page separation
  - search mru
  - appinsights
  Style
  x icons
  x light mode vs dark mode
 */

const App = () => {
  return (
    <ErrorBoundary
      fallback={<C.Error>Some error occurred. See console.</C.Error>}
    >
      <Suspense fallback={<C.Spinner />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<P.Home />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
