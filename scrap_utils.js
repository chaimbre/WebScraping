const puppeteer = require('puppeteer')

const CHROME_PATH_64="C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
const CHROME_PATH_32="C:/Program Files/Google/Chrome/Application/chrome.exe"

async function getDataFromLink( browser, url ) 
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
module.exports.CHROME_PATH_64 = CHROME_PATH_64
module.exports.CHROME_PATH_32 = CHROME_PATH_32