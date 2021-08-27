/*
BANCO ATLAS
BANCO BAASA
BANCO BNF
BANCO CONTINENTAL
BANCO FAMILIAR
BANCO GNB (BBVA)
BANCO INTERFISA
BANCO VISIÓN
CAMBIOS ALBERDI
CAMBIOS BONANZA
CAMBIOS CHACO
CAMBIOS EUROCAMBIOS
CAMBIOS FE
CAMBIOS LA MONEDA
CAMBIOS MAXICAMBIOS
CAMBIOS MERCOSUR
CAMBIOS MUNDIAL
CAMBIOS MYD
CAMBIOS NORTE
CAMBIOS PANORAMA
CAMBIOS RIO PARANA
CAMBIOS YRENDAGUE
CAMBIOS ZAFRA
GOV BCP
GOV SET
*/
const puppeteer = require('puppeteer');

const removeAcentos = (text) =>{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    text = text.replace("³", "");
    return text;                 
};

const bancoAtlas = async() => {
    const monedaNames = ['EUR','USD','BRL','ARS'];

    //Obtenemos las cotizaciones
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.bancoatlas.com.py/web/", { waitUntil: 'networkidle0'});
    let compra  = await page.evaluate(() => Array.from(document.querySelectorAll("table.cotizacion-table tbody tr td:nth-child(2)"), element => element.textContent));
    let venta  = await page.evaluate(() => Array.from(document.querySelectorAll("table.cotizacion-table tbody tr td:nth-child(3)"), element => element.textContent));
    await browser.close();

    //Armamos el objeto
    let  cotizacionesBancoAtlas = {}, i = 0;
    monedaNames.forEach((moneda) =>{
        cotizacionesBancoAtlas[moneda] = {
            compra:parseFloat(compra[i]),
            venta:parseFloat(venta[i])
        };
        i++;
    });
    return cotizacionesBancoAtlas;
};

const bancoBaasa = async() => {
    const monedaNames = ['USD','','BRL','ARS','EUR'];

    //Obtenemos las cotizaciones
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.bancobasa.com.py/", { waitUntil: 'networkidle0'});
    let compra  = await page.evaluate(() => Array.from(document.querySelectorAll("ul.trendscontent>li>a.search_link>span.compra"), element => element.textContent));
    let venta  = await page.evaluate(() => Array.from(document.querySelectorAll("ul.trendscontent>li>a.search_link>span.venta"), element => element.textContent));
    await browser.close();

    //Armamos el objeto
    let  cotizacionesBancoBaasa = {}, i = 0;
    monedaNames.forEach((moneda) =>{
        cotizacionesBancoBaasa[moneda] = {
            compra:parseFloat(compra[i]),
            venta:parseFloat(venta[i])
        };
        i++;
    });
    delete cotizacionesBancoBaasa[''];
    return cotizacionesBancoBaasa;
};

const bancoBnf = async() => {
    const monedaNames = ['USD','ARS','BRL','EUR'];

    //Obtenemos las cotizaciones
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.bnf.gov.py/", { waitUntil: 'networkidle0'});
    let compra  = await page.evaluate(() => Array.from(document.querySelectorAll("table.cotiz-tabla tbody tr td:nth-child(2)"), element => element.textContent));
    let venta  = await page.evaluate(() => Array.from(document.querySelectorAll("table.cotiz-tabla tbody tr td:nth-child(3)"), element => element.textContent));
    await browser.close();

    //Armamos el objeto
    let  cotizacionesBancoBnf = {}, i = 0;
    monedaNames.forEach((moneda) =>{
        cotizacionesBancoBnf[moneda] = {
            compra:parseFloat(compra[i]),
            venta:parseFloat(venta[i])
        };
        i++;
    });
    return cotizacionesBancoBnf;
};

const bancoContinental = async() => {

};

const bancoFamiliar = async() => {

};

const bancoGnb = async() => {

};

const bancoInterfisa = async() => {

};

const bancoVision = async() => {

};

const cambiosAlberdi = async() => {

};

const cambiosBonanza = async() => {

};

const cambiosChaco = async() => {

};

const cambiosEurocambios = async() => {

};

const cambiosFe = async() => {

};

const cambiosMaxiCambios = async() => {

};

const cambiosMercosur = async() => {

};

const cambiosMundial = async() => {

};

const cambiosMYD = async() => {

};

const cambiosNorte = async() => {

};

const cambiosPanorama = async() => {

};

const cambiosRioParana = async() => {

};

const cambiosYrendague = async() => {

};

const cambiosZafra = async() => {

};

const govBCP = async() => {

};

const govSET = async() => {

};

const main = async() => {
    
    console.log("cotizacionesBancoAtlas");
    console.log(await bancoAtlas());

    console.log("cotizacionesBancoBaasa");
    console.log(await bancoBaasa());

    console.log("cotizacionesBancoBNF");
    console.log(await bancoBnf());
};
main();




