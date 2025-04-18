const puppeteer = require('puppeteer');
const { ipcRenderer } = require('electron');

async function poblarDatabase() {
    ipcRenderer.send('mostrar-mensaje', "Boton pulsado");
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36'
        ]
    });
    const page = await browser.newPage();
    await page.goto('https://www.metacritic.com/browse/game/', {
        waitUntil: 'domcontentloaded'
    });
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9'
    });
    ipcRenderer.send('mostrar-mensaje', "Entra en la web correctamente");

    await page.waitForSelector('[data-testid="filter-results"]');
    const juegos = await page.$$eval('[data-testid="filter-results"]', items => {
        return items.map(el => {
            const linkEl = el.querySelector('a');
            return {
                url: linkEl ? 'https://www.metacritic.com' + linkEl.getAttribute('href') : null,
            };
        });
    });

    console.log(juegos);

    await browser.close();
    ipcRenderer.send('mostrar-mensaje', "Web cerrada correctamente");
}


module.exports = { poblarDatabase }