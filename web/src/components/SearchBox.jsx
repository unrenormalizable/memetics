import { useDebouncedCallback } from 'use-debounce'

const SearchBox = ({ query, setQuery }) => {
  const debounced = useDebouncedCallback((value) => {
    setQuery(value)
  }, 500)

  return (
    <div className="text-center">
      <input
        type="search"
        id="default-search"
        className="my-5 w-5/6 rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="Search memes..."
        defaultValue={query}
        onChange={(e) => debounced(e.target.value)}
        required
      />
    </div>
  )
}

export default SearchBox
