const puppeteer = require('puppeteer')

const CHROMIUM_PATH_64= "C:/Users/Bruns/AppData/Local/Chromium/Application/chrome.exe"
const CHROME_PATH_64="C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
const CHROME_PATH_32="C:/Program Files/Google/Chrome/Application/chrome.exe"

async function getDataFromLink( browser, url ) 
{
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 } );

  console.log( "Reading from " + url )

  const result = await page.evaluate(() => 
  {
    const title = document.querySelector( "h2").innerText;
    const prices = [...document.querySelectorAll( ".price") ].map( element => element.textContent );
    return [title,prices[0],prices[1]];
  })

  return result
}

async function getDataFromLinks( browser, url ) 
{
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 } );
  
  const showmoresel = "#eventpathlist-showmore"
  if (await page.$(showmoresel) != null)
    await page.click( showmoresel )

  const results = await page.evaluate(() => 
  {  
    const titles = [...document.querySelectorAll( "div.cell-event a") ].map( element => element.textContent );
    const prices = [...document.querySelectorAll( ".price") ].map( element => element.textContent );
    var tmp = titles 
    if ( 2*titles.length < prices.length )
	return titles
    for ( var idx=0; idx<titles.length; idx++ ) {
	tmp[idx] = [titles[idx],prices[2*idx],prices[2*idx+1]]
    }
    return tmp
  })

  return results
}

function putToExcel( value )
{
  var excel = require('excel4node');
  var workbook = new excel.Workbook();
  var worksheet = workbook.addWorksheet('Unibet 1');

  // Create a reusable style
  var style = workbook.createStyle( 
  {
    font: { color: '#FF0800', size: 12 },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
  });

  for ( var idx=0; idx<value.length; idx++ )
  {
    worksheet.cell(idx+1,1).string( value[idx][0] ).style(style);
    worksheet.cell(idx+1,2).string( value[idx][1] ).style(style);
    worksheet.cell(idx+1,3).string( value[idx][2] ).style(style);
  }
 
  workbook.write('Excel.xlsx');
}
 
module.exports.getDataFromLink  = getDataFromLink;
module.exports.getDataFromLinks  = getDataFromLinks;
module.exports.putToExcel = putToExcel;
module.exports.CHROME_PATH_64 = CHROME_PATH_64
module.exports.CHROME_PATH_32 = CHROME_PATH_32
