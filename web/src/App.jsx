import { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {
  AppInsightsContext,
  AppInsightsErrorBoundary,
} from '@microsoft/applicationinsights-react-js'
import { reactPlugin } from './appInsights'
import * as P from './pages'
import * as C from './components'
import './App.css'

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
  x search mru
  - appinsights
  Style
  x icons
  x light mode vs dark mode
 */

const App = () => {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <AppInsightsErrorBoundary
        onError={() => <C.Error>Some error occurred. See console.</C.Error>}
        appInsights={reactPlugin}
      >
        <Suspense fallback={<C.Spinner />}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<P.Home />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </AppInsightsErrorBoundary>
    </AppInsightsContext.Provider>
  )
}

export default App
