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

const App = () => {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <AppInsightsErrorBoundary
        onError={() => (
          <C.Error>
            Some error occurred. Report the stack trace in console and try
            refreshing.
          </C.Error>
        )}
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
