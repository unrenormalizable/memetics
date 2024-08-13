import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDebouncedCallback } from 'use-debounce'

const SearchBox = ({ setQuery }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const input = useRef(null)

  useEffect(() => {
    setQuery(searchParams.get('q'))
  }, [setQuery, searchParams])

  useHotkeys('/', (e) => {
    input.current.focus()
    e.preventDefault()
  })

  const debounced = useDebouncedCallback((value) => {
    setQuery(value)
    setSearchParams({ q: value })
  }, 500)

  return (
    <div className="text-center">
      <input
        ref={input}
        type="search"
        id="default-search"
        className="my-5 w-5/6 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="Search memes... (shortcut '/')"
        defaultValue={searchParams.get('q')}
        onChange={(e) => debounced(e.target.value)}
        required
      />
    </div>
  )
}

export default SearchBox
