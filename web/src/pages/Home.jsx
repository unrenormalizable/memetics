import { useState } from 'react'
import * as C from '../components'

const Home = () => {
  const [query, setQuery] = useState('')

  return (
    <main className="flex h-screen w-screen flex-col">
      <header className="flex-none text-center">
        <h1 className="my-3 text-5xl font-bold">memetics</h1>
      </header>
      <section className="flex-none">
        <C.SearchBox setQuery={setQuery} />
      </section>
      <section className="flex-grow overflow-y-auto px-3">
        <C.MemesDisplay query={query} />
      </section>
      <footer className="flex-none">
        <C.Footer
          appVersion={`${import.meta.env.VITE_APP_VERSION}`}
          commitId={import.meta.env.VITE_APP_COMMIT_ID}
        />
      </footer>
    </main>
  )
}

export default Home
