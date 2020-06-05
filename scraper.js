const puppeteer = require('puppeteer');
const userAgent = require('user-agents');

fetch = async (url) => {
    const startTime = Date.now();
    const scrapeDate = new Date();
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]

    });

    try {

        const page = await browser.newPage();
        await page.setUserAgent(userAgent.toString());
        await page.goto(url, { waitUntil: 'networkidle2' });

        const html = await page.evaluate(
            function callback() {
                href_array = Array.from(document.querySelectorAll('h2>a'), element => element.getAttribute("href"));
                text_array = Array.from(document.querySelectorAll('h2>a'), element => element.innerHTML);
                return { href_array: href_array, text_array: text_array }
            }
        )

        // questa variabile serve come buffer per non inserire titoli duplicati
        const container = { text: {}, href: {} };

        // questo array serve come struttura finale da condividere
        const data = new Array;

        html.text_array.forEach(function (element, index) {

            // questo blocco filtra i risultati
            if (!(element in container.text) && (element.split(" ").length >= 3)) {
                container.text[index] = element
                container.href[index] = html.href_array[index]

                // questo blocco forma l'array finale
                data.push({
                    //l'id è formato preso dall'url dentro l'attributo href. NOTA: alcuni url sono 'invalidi' ma sono stati filtrati selezionando i text con grandezza > 3
                    id: html.href_array[index].match(/\(|\)|\d{8}/)[0],
                    text: element,
                    href: html.href_array[index],
                    source: "LiberoQuotidiano",
                    date: scrapeDate.toISOString()
                })

            }
        });

        //console.log(container)

        console.log({ data })

        await browser.close();
        console.log('Tempo impiegato: ', (Date.now() - startTime) / 1000, 's');

        // è importate restituire un oggetto
        return { data };

    } catch (error) {
        console.log("ERRORE: " + error)
    } finally {

        browser.close();
    }

}

// per importare le classi (funzioni) definite qui come moduli
module.exports.fetch = fetch


