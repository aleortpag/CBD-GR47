const puppeteer = require('puppeteer');
const { ipcRenderer } = require('electron');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'metacritic_scraper';
const COLLECTION_NAME = 'juegos';

async function poblarDatabase() {
    ipcRenderer.send('mostrar-mensaje', "Boton pulsado");

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

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
    await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });

    let nPagina = 1;
    let iteraciones = 1;

    do {
        const url = 'https://www.metacritic.com/browse/game/?releaseYearMin=1958&releaseYearMax=2025&page=';
        await page.goto(url + nPagina, { waitUntil: 'domcontentloaded' });
        ipcRenderer.send('mostrar-mensaje', "Entra en pagina n: " + nPagina);

        try {
            await page.waitForSelector('[data-testid="filter-results"]');

            const enlaces = await page.$$eval('[data-testid="filter-results"] a', links =>
                links.map(a => 'https://www.metacritic.com' + a.getAttribute('href'))
            );

            for (let i in enlaces) {
                try {
                    const enlace = enlaces[i];
                    ipcRenderer.send('mostrar-mensaje', "Entrando en " + enlace);
                    await page.goto(enlace, { waitUntil: 'domcontentloaded' });
                    await page.waitForSelector('div[data-testid="hero-title"]');
                    const nombre = await page.$eval('div[data-testid="hero-title"] h1', el => el.textContent.trim());
                    const plataformas = await page.$$eval('div[class*="gameDetails_Platforms"] ul li', lista => lista.map(el => el.textContent.trim()));
                    const fechaLanzamiento = await page.$eval('div[class*="gameDetails_ReleaseDate"] span:nth-of-type(2)', el => el.textContent.trim());
                    const metascore = await page.$eval('div[data-testid="critic-score-info"] div[title^="Metascore"]', el => parseInt(el.textContent.trim()));
                    const userScore = await page.$eval('div[data-testid="user-score-info"] div[title^="User score"]', el => parseFloat(el.textContent.trim()));
                    const desarrolladores = await page.$$eval('div[class*="gameDetails_Developer"] ul li', lista => lista.map(el => el.textContent.trim()));
                    const publicador = await page.$eval('div[class*="gameDetails_Distributor"] :nth-child(2)', el => el.textContent.trim());
                    const generos = await page.$$eval('ul[class*="genreList"] li', lista => lista.map(el => el.textContent.trim()));
                    ipcRenderer.send('mostrar-resultado', "Nombre: " + publicador);
                } catch (error) {
                    ipcRenderer.send('mostrar-error', error);
                }

            }
        } catch (error) {
            ipcRenderer.send('mostrar-error', error);

        } finally {
            nPagina++;
            iteraciones--;
        }

    } while (iteraciones > 0);
    await browser.close();
    ipcRenderer.send('mostrar-mensaje', "Web cerrada correctamente");
};
module.exports = { poblarDatabase }