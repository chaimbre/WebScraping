const puppeteer = require('puppeteer')
const utils = require('./scrap_utils')

const getFromLink = async (browser, url) => 
{ 
  return utils.getDataFromLink( browser, url )
}

const getData = async () => 
{
  const args = process.argv.slice(2)
  const is_headless = args[1]
  const url = args[0]

  const browser = await puppeteer.launch( {executablePath: utils.CHROME_PATH_64, headless: is_headless })
  const result = await getFromLink( browser, url )
  
  browser.close()
  return result
}

getData().then(value => 
{
  console.log(value)
})
 
