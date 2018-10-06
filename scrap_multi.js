const puppeteer = require("puppeteer")
const utils = require( "./scrap_utils" )

const getAllLinks = async (browser,url) => {

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 } );
  await page.waitFor( 3000 );

  //const linksArray = await page.$$( '.cell-event a' );
  const linksArray = await page.evaluate( () => [...document.querySelectorAll( '.cell-event a' ) ].map( link => link.href) );
  return linksArray;
}

const scrap = async () => 
{
  const args = process.argv.slice(2)
  const is_headless = args[1]
  const url = args[0]

  const browser = await puppeteer.launch({executablePath: utils.CHROME_PATH_64, headless: is_headless })
  const lkList = await getAllLinks(browser,url)
  const results = await Promise.all(
    lkList.map(link => utils.getDataFromLink(browser, link)),
  )
  browser.close()
  return results
}

scrap().then(value => 
{
  console.log( "Nb events found:" + value.length )
  console.log(value)
  utils.putToExcel( value )
})
.catch(e => console.log(`error: ${e}`))
