import { Suspense, useState } from 'react'
import { preload } from 'swr'
import { ErrorBoundary } from 'react-error-boundary'
import * as C from './components'
import * as Constants from './constants'
import './App.css'

/*
  Structure
  - Layout
  - Search event hooked up
  - loader spinners (swr)
  - errors (react-error-boundary)
  Enhancements
  - Kbd only navigation + hints (react-hotkeys-hook)
  - search mru
  - deep link
  - mobile
  - appinsights
  - image component placeholders
  Style
  - icons
  - light mode vs dark mode
 */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const fetcher = async (url) => {
  const res = await fetch(url)

  await sleep(1000)

  if (!res.ok) {
    const message = `An error has occured: ${res.status}`
    throw new Error(message)
  }

  const json = await res.json()
  return json
}

preload(Constants.INDEX_JSON, fetcher)

const App = () => {
  const [query, setQuery] = useState('')

  return (
    <ErrorBoundary fallback={<C.Error>Could not fetch data.</C.Error>}>
      <Suspense fallback={<C.Spinner />}>
        <main className="flex h-screen w-screen flex-col">
          <header className="flex-none text-center">
            <h1 className="my-3 text-5xl font-bold">memetics</h1>
          </header>
          <section className="flex-none">
            <C.SearchBox query={query} setQuery={setQuery} />
          </section>
          <section className="flex-grow overflow-y-auto">
            <C.MemesDisplay query={query} />
          </section>
          <footer className="mt-1 flex-none text-center">
            <C.Footer
              appVersion={`${import.meta.env.VITE_APP_VERSION}`}
              commitId={import.meta.env.VITE_APP_COMMIT_ID}
            />
          </footer>
        </main>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
