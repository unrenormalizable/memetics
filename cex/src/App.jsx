import './App.css'

const getURL =
  typeof chrome !== 'undefined' ? chrome.runtime.getURL : (path) => path

const memeticsLogoUrl = getURL('/icon.svg')

const App = () => (
  <div className="App">
    <div className="flex flex-row justify-center">
      <a
        className="flex-none"
        href="https://memetics-app.vercel.app"
        target="_blank"
      >
        <img src={memeticsLogoUrl} className="logo" alt="memetics logo" />
      </a>
    </div>
    <div className="text-base">memetics downloader extension </div>
    <div className="text-xs">
      {`${import.meta.env.VITE_APP_VERSION} (${import.meta.env.VITE_APP_COMMIT_ID})`}
    </div>
  </div>
)

export default App
