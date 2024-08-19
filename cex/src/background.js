const onclickHandler = (info, tab) => {
  // eslint-disable-next-line no-console
  console.log('onclick handler', info, tab)
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'download meme',
    title: 'download meme',
    type: 'normal',
    contexts: ['image'],
  })
})

chrome.contextMenus.onClicked.addListener(onclickHandler)
