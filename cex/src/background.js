/* eslint-disable no-alert */
/* eslint-disable no-bitwise */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
// @ts-nocheck

// NOTE:
// Test cases:
// - FB X Twitter
// - Profile X Feed
// - Single image X Multiple image

//
// This script is injected into the page. It requires a full set of redefinitions for now.
// Will check later how to share the code.
//
const __injectedFnDownloadImageWithInfo = async (info) => {
  const __logInfo = console.log
  const __logError = console.error
  // NOTE: Violation of OCP. Refactor when we support a 3rd site.
  const __isHost = (host) => {
    const url = new URL(window.location.href)
    return url.hostname.toLocaleLowerCase().endsWith(host)
  }
  const __isTwitter = () => __isHost('x.com')
  const __isFacebook = () => __isHost('facebook.com')

  const imageUrl = info.srcUrl
  const contextUrl = info.linkUrl
  __logInfo('>>>> downloadImageWithInfo', info)

  const __cyrb53Hash = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed
    let h2 = 0x41c6ce57 ^ seed
    // eslint-disable-next-line no-plusplus
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i)
      h1 = Math.imul(h1 ^ ch, 2654435761)
      h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
  }

  const __getExtensionFromStreamType = (type) => {
    const typeParts = !type ? [] : type.split('/')
    if (typeParts.length !== 2) {
      const message = `type not defined or not in expected format ${type}`
      alert(message)
      throw new Error(message)
    }

    return typeParts[1]
  }

  const __downloadBlob = (fileName, blob) => {
    const objUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objUrl
    link.download = fileName
    link.click()
    link.remove()
    URL.revokeObjectURL(objUrl)
  }

  const __createImageBlob = async (imgUrl, imgUrlHash) => {
    const imageStream = await fetch(imgUrl)
    const blob = await imageStream.blob()
    const fileExtension = __getExtensionFromStreamType(blob.type)
    const fileName = `memetics_${imgUrlHash}.${fileExtension}`
    __logInfo('downloadImage', blob, fileName)

    return [fileName, blob]
  }

  const __getNearbyText = (imgUrl) => {
    const e = document.querySelector(`img[src="${imgUrl}"]`)

    let nearbyText = `${e?.alt} `
    if (__isTwitter()) {
      nearbyText += e?.closest("article[data-testid='tweet']")?.innerText ?? ''
    }

    if (__isFacebook()) {
      nearbyText +=
        e
          ?.closest("div[data-virtualized='false']")
          ?.innerText?.replace(/(Comment as .*)/, '')
          ?.replace(/(Facebook)*/gi, '') ?? ''
    }

    nearbyText = nearbyText?.replace(/\s/g, ' ')?.replace(/\s\s+/g, ' ')
    if (!nearbyText) {
      const message = `Unsupported host or image scraping selectors need updating: ${imgUrl}`
      alert(message)
      throw new Error(message)
    }

    return nearbyText
  }

  const __createInfoBlob = async (imgUrl, imgUrlHash, normalizedContextUrl) => {
    const nearbyText = __getNearbyText(imgUrl)
    const blob = new Blob(
      [JSON.stringify({ context: normalizedContextUrl, nearbyText })],
      {
        type: 'application/json',
      }
    )
    const fileName = `memetics_${imgUrlHash}.json`
    __logInfo('downloadInfo', blob, fileName)

    return [fileName, blob]
  }

  const __normalizeContextUrl = (ctxtUrl) => {
    const twitterUrlCracker = /\/photo\/\d+$/
    if (__isTwitter() && twitterUrlCracker.test(ctxtUrl)) {
      return ctxtUrl.replace(twitterUrlCracker, '')
    }

    if (__isFacebook()) {
      const url = new URL(ctxtUrl)
      url.searchParams.delete('__cft__[0]')
      url.searchParams.delete('__tn__')
      return url.href
    }

    __logError('Unsupported host', ctxtUrl)
    return ctxtUrl
  }

  try {
    const normalizedContextUrl = __normalizeContextUrl(contextUrl)
    const imageUrlHash = __cyrb53Hash(imageUrl).toString(16)

    __logInfo(
      'Downloading image & info for',
      imageUrl,
      imageUrlHash,
      normalizedContextUrl
    )

    const [imgFileName, imgBlob] = await __createImageBlob(
      imageUrl,
      imageUrlHash
    )
    __downloadBlob(imgFileName, imgBlob)

    const [infoFileName, infoBlob] = await __createInfoBlob(
      imageUrl,
      imageUrlHash,
      normalizedContextUrl
    )
    __downloadBlob(infoFileName, infoBlob)
  } catch (e) {
    __logError('memetics: Failed to execute script:', e, info)
  }
}

//
// background.js stuff. All previous code is injected into the page.
//
const downloadMemeMenuItemId = 'saveImageWithText'
const logInfo = console.log
const logError = console.error

const downloadMemeClickedHandler = async (info, tab) => {
  try {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      func: __injectedFnDownloadImageWithInfo,
      args: [info],
    })
  } catch (e) {
    logError('memetics: Failed to execute script:', info, tab, e)
  }
}

chrome.contextMenus.create({
  id: downloadMemeMenuItemId,
  title: 'Save meme...',
  contexts: ['image'],
})

const menuItemClickedHandler = async (info, tab) => {
  logInfo('memetics: menu item clicked', info, tab)
  if (info.menuItemId === downloadMemeMenuItemId) {
    await downloadMemeClickedHandler(info, tab)
  }
}

const downloadsDeterminingFilenameHandler = async (item, __suggest) => {
  logInfo('>>>> determiningFilename', item, __suggest)
  await __suggest({
    filename: item.filename,
    conflictAction: 'overwrite',
  })

  return true
}

chrome.downloads.onDeterminingFilename.addListener(
  downloadsDeterminingFilenameHandler
)
chrome.contextMenus.onClicked.addListener(menuItemClickedHandler)
