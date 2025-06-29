const puppeteer = require('puppeteer');
const { ipcRenderer } = require('electron');
const { guardarJuego } = require('./database.js');

async function scrapping() {
    try {
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
        ipcRenderer.send('mostrar-mensaje', "Comienza el scrapping");

        let nPagina = 1;
        let iteraciones = 20; // Determina el numero de paginas a las que se va a realizar el scrapping

        do {
            const url = 'https://www.metacritic.com/browse/game/?releaseYearMin=1958&releaseYearMax=2025&page=';
            await page.goto(url + nPagina, { waitUntil: 'domcontentloaded' });
            ipcRenderer.send('mostrar-mensaje', "Entrando en la pagina n: " + nPagina);

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
                        const nombre = await page.$eval('div[data-testid="hero-title"] h1', el => el.textContent.trim()).catch(() => 'Desconocido');
                        const plataformas = await page.$$eval('div[class*="gameDetails_Platforms"] ul li', lista => lista.map(el => el.textContent.trim())).catch(() => ['Desconocido']);
                        const fechaLanzamiento = await page.$eval('div[class*="gameDetails_ReleaseDate"] span:nth-of-type(2)', el => el.textContent.trim()).catch(() => 'Desconocido');
                        const metascore = await page.$eval('div[data-testid="critic-score-info"] div[title^="Metascore"]', el => parseInt(el.textContent.trim())).catch(() => parseInt('50'));
                        const userScore = await page.$eval('div[data-testid="user-score-info"] div[title^="User score"]', el => parseFloat(el.textContent.trim())).catch(() => parseFloat('5.0'));
                        const desarrolladores = await page.$$eval('div[class*="gameDetails_Developer"] ul li', lista => lista.map(el => el.textContent.trim())).catch(() => ['Desconocido']);
                        const publicador = await page.$eval('div[class*="gameDetails_Distributor"] :nth-child(2)', el => el.textContent.trim()).catch(() => 'Desconocido');
                        const generos = await page.$$eval('ul[class*="genreList"] li', lista => lista.map(el => el.textContent.trim())).catch(() => ['Desconocido']);

                        const juego = {
                            nombre,
                            plataformas,
                            fechaLanzamiento,
                            metascore,
                            userScore,
                            desarrolladores,
                            publicador,
                            generos,
                            enlace
                        };

                        await guardarJuego(juego);

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
        ipcRenderer.send('mostrar-resultado', "Web cerrada correctamente");
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
};
module.exports = { scrapping }