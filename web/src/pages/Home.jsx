import { useState } from 'react'
import * as C from '../components'
import Logo from '../assets/icon.svg'

const Home = () => {
  const [query, setQuery] = useState('')
  const [memeCount, setMemeCount] = useState(0)

  return (
    <main className="flex h-screen w-screen flex-col">
      <header className="flex flex-none flex-col text-center">
        <h1 className="my-0 flex flex-row justify-center text-3xl font-bold">
          <img
            className="flex-none"
            src={Logo}
            width="40px"
            height="40px"
            alt="memetics logo"
          />
          <div>memetics</div>
        </h1>
        <h2 className="my-0 text-sm">a meme network. free, always will be.</h2>
      </header>
      <section className="flex-none">
        <C.SearchBox setQuery={setQuery} memeCount={memeCount} />
      </section>
      <section className="flex-grow overflow-y-auto px-3">
        <C.MemesDisplay query={query} setMemeCount={setMemeCount} />
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
