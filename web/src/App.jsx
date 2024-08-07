import './App.css'

const Footer = () => {
  return (
    <footer className="grow-0 py-0 text-xs">
      <a href="https://github.com/unrenormalizable/memetics" target="_blank">
        memetics
      </a>
      <span> &bull; </span>
      <a
        href={`https://github.com/unrenormalizable/memetics/actions/runs/${import.meta.env.VITE_APP_COMMIT_ID}`}
        target="_blank"
      >{`${import.meta.env.VITE_APP_VERSION}`}</a>
    </footer>
  )
}

const App = () => {
  return (
    <>
      <main className="grow">
        <h1 className="text-5xl font-bold">memetics</h1>
        <div className="card">
          <p>Coming soon!</p>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App
