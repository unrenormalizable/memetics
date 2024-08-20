/* eslint-disable no-bitwise */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
// @ts-nocheck

const downloadMemeMenuItemId = 'saveImageWithText'
const logInfo = console.log
const logError = console.error

const __injectedFnDownloadImageWithInfo = async (info) => {
  // This script is injected into the page. It requires a full set of redefinitions for now.
  // Will check later how to share the code.
  //

  const __logInfo = console.log
  const __logError = console.error

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
      throw new Error(`type not defined or not in expected format ${type}`)
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

  const __createImageBlob = async (imageURL, imageUrlHash) => {
    const imageStream = await fetch(imageURL)
    const blob = await imageStream.blob()
    const fileExtension = __getExtensionFromStreamType(blob.type)
    const fileName = `memetics_${imageUrlHash}.${fileExtension}`
    __logInfo('downloadImage', blob, fileName)

    return [fileName, blob]
  }

  const __createInfoBlob = async (imageUrl, imageUrlHash, linkUrl) => {
    const imageElement = document.querySelector(`img[src="${imageUrl}"]`)
    const nearbyText = `${imageElement?.alt || ''} ${imageElement.closest('figure')?.innerText || ''} ${imageElement.closest('article')?.innerText || ''} ${imageElement.closest('div')?.innerText || ''}`

    const blob = new Blob([JSON.stringify({ url: linkUrl, nearbyText })], {
      type: 'application/json',
    })
    const fileName = `memetics_${imageUrlHash}.json`
    __logInfo('downloadInfo', blob, fileName)

    return [fileName, blob]
  }

  try {
    const srcUrlHash = __cyrb53Hash(info.srcUrl).toString(16)
    __logInfo('>>>> ', info.srcUrl, srcUrlHash)

    const [imgFileName, imgBlob] = await __createImageBlob(
      info.srcUrl,
      srcUrlHash
    )
    __downloadBlob(imgFileName, imgBlob)

    const [infoFileName, infoBlob] = await __createInfoBlob(
      info.srcUrl,
      srcUrlHash,
      info.linkUrl
    )
    __downloadBlob(infoFileName, infoBlob)
  } catch (e) {
    __logError('memetics: Failed to execute script:', e, info)
  }
}

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

chrome.contextMenus.onClicked.addListener(menuItemClickedHandler)
