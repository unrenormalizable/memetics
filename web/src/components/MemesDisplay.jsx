import { useEffect, useMemo, useState } from 'react'
import { Gallery } from 'react-grid-gallery'
import FlexSearch from 'flexsearch'
import useSWR from 'swr'
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { fetcher } from '../utils'
import * as Constants from '../constants'

const buildIndex = (reg) => {
  const index = new FlexSearch.Index({
    tokenize: 'forward',
  })

  reg.forEach((e) => index.add(e.id, e.description))

  return index
}

const MemesDisplay = ({ query }) => {
  const ai = useAppInsightsContext()
  const { data: registry } = useSWR(Constants.INDEX_JSON, fetcher, {
    suspense: true,
  })
  const [index, setIndex] = useState(null)
  const [registryMap, setRegistryMap] = useState({})

  useEffect(() => {
    const idx = buildIndex(registry)
    setIndex(idx)
    setRegistryMap(
      registry
        .map((e) => {
          e.src = `${Constants.MEME_BASE}/${e.img}`
          return e
        })
        .sort((a, b) => a.id - b.id)
    )
  }, [registry])

  const filtered = useMemo(() => {
    if (!index || !query || query.length === 0) {
      return []
    }

    return index.search(query).map((i) => registryMap[i])
  }, [index, registryMap, query])

  ai.trackEvent({ name: 'memetics-search' }, { query, count: filtered.length })
  if (!filtered.length) {
    return (
      <div className="h-full content-center text-center">
        Use the search box to find memes (shortcut &apos;/&apos;).
      </div>
    )
  }
  return <Gallery images={filtered} />
}

export default MemesDisplay
