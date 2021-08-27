/*
BANCO AMAMBAY O BASA
BANCO ATLAS
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

const bancoBaasa = async () => {
    const monedaNames = ['USD','','BRL','ARS','EUR'];

    //Obtenemos las cotizaciones
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.bancobasa.com.py/", { waitUntil: 'networkidle0'});
    let compra  = await page.evaluate((div) => Array.from(document.querySelectorAll("ul.trendscontent>li>a.search_link>span.compra"), element => element.textContent));
    let venta  = await page.evaluate((div) => Array.from(document.querySelectorAll("ul.trendscontent>li>a.search_link>span.venta"), element => element.textContent));
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
    console.log(cotizacionesBancoBaasa);
};
bancoBaasa();


const bancoAtlas = () => {

};

const bancoBnf = () => {

};

const bancoContinental = () => {

};

const bancoFamiliar = () => {

};

const bancoGnb = () => {

};

const bancoInterfisa = () => {

};

const bancoVision = () => {

};

const cambiosAlberdi = () => {

};

const cambiosBonanza = () => {

};

const cambiosChaco = () => {

};

const cambiosEurocambios = () => {

};

const cambiosFe = () => {

};

const cambiosMaxiCambios = () => {

};

const cambiosMercosur = () => {

};

const cambiosMundial = () => {

};

const cambiosMYD = () => {

};

const cambiosNorte = () => {

};

const cambiosPanorama = () => {

};

const cambiosRioParana = () => {

};

const cambiosYrendague = () => {

};

const cambiosZafra = () => {

};

const govBCP = () => {

};

const govSET = () => {

};







