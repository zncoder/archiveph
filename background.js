const urlRe = new RegExp('https://archive.ph/[a-zA-Z0-9]+"')

async function loadPage() {
  let [tab] = await call(chrome.tabs.query, { active: true, lastFocusedWindow: true })
  let queryUrl = `https://archive.ph/${tab.url}`
  console.log(queryUrl)
  let resp = await fetch(queryUrl)
  let text = await resp.text()
  let url = text.match(urlRe)[0].slice(0, -1)
  console.log(url)
  await call(chrome.tabs.update, {url: url})
}

chrome.browserAction.onClicked.addListener(loadPage)

function call(fn, ...args) {
  return new Promise(resolve => {
    args.push(x => {
      if (chrome.runtime.lastError) {
        console.log("error", chrome.runtime.lastError.message)
      }
      resolve(x)
    })
    fn(...args)
  })
}
