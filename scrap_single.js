const puppeteer = require('puppeteer')

const CHROME_PATH_64="C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
const CHROME_PATH_32="C:/Program Files/Google/Chrome/Application/chrome.exe"

const getDataFromLink = async (browser, url) => 
{
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 } );
 
  const result = await page.evaluate(() => 
  {
    let title = document.querySelector('h2').innerText
    const prices = Array.from( document.querySelectorAll( '.price' ), element => element.textContent );
    return [title,prices[0],prices[1]];
  })
  return result
}

const getData = async () => 
{
  const args = process.argv.slice(2)
  const is_headless = args[1]
  const url = args[0]

  const browser = await puppeteer.launch( {executablePath: CHROME_PATH_64, headless: is_headless })
  const result = await getDataFromLink( browser, url )
  
  browser.close()
  return result
}

getData().then(value => 
{
  console.log(value)
})
