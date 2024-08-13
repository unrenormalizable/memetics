import { useEffect, useMemo, useState } from 'react'
import { Gallery } from 'react-grid-gallery'
import FlexSearch from 'flexsearch'
import useSWR from 'swr'
import * as Constants from '../constants'
import { fetcher } from '../utils'
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js'

const buildIndex = (reg) => {
  const index = new FlexSearch.Index({
    tokenize: 'forward',
  })

  reg.forEach((e) => index.add(e.id, e.description))

  return index
}

const MemesDisplay = ({ query }) => {
  const ai = useAppInsightsContext()
  let { data: registry } = useSWR(Constants.INDEX_JSON, fetcher, {
    suspense: true,
  })
  let [index, setIndex] = useState(null)
  let [registryMap, setRegistryMap] = useState({})

  useEffect(() => {
    const index = buildIndex(registry)
    setIndex(index)
    setRegistryMap(
      registry
        .map((e) => {
          let x = { ...e }
          x.src = `${Constants.MEME_BASE}/${e.img}`
          return x
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
