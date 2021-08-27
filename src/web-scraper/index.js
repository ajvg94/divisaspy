/*
CAMBIOS CHACO
MAXICAMBIOS
SET
INTERFISA
AMAMBAY o BASA
MYD CAMBIOS
MUNDIAL CAMBIOS
VISIÓN BANCO
CDE La Moneda Cambios S.A.
CDE Bonanza Cambios
FE CAMBIOS
zafra cambios
cambios rio parana
CDE mercosur cambios
panorama cambios
CDE cambios yrendague
banco continental
BNF
banco familiar
BCP 
banco atlas
BBVA
EURO CAMBIOS
CAMBIOS ALBERDI (http://cambiosalberdi.com/) NO EXISTE (?)
norte cambios
*/
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const removeAcento = (text) =>{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
};
//*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
//#region BANCOS
const getCotzBancoBASA = async () => {
	const monedaNames = ['USD','','BRL','ARS','EUR'];
	let response = await axios.get('https://www.bancobasa.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, bancoBasa = [], arrayIndex = 0;
	cambiosArray = $('ul.trendscontent>li>a.search_link');
	cambiosArray.each(function () {
		let cotzMoneda = {};
		cotzMoneda.moneda = monedaNames[arrayIndex];
		cotzMoneda.compra = parseFloat($(this).find('span.compra').text());
		cotzMoneda.venta = parseFloat($(this).find('span.venta').text());
		bancoBasa.push(cotzMoneda);
		arrayIndex++;
	});
	bancoBasa.splice(1,1);

	return(bancoBasa);
};

const getCotzBancoBNF = async () => {
    const monedaNames = ['USD','','BRL','ARS','EUR'];
	let response = await axios.get('https://www.bnf.gov.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('#modalCotizaciones>.modal-dialog>.modal-content>.modal-body>table>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push($(this).text().trim());
		});
	});
	let cotzMoneda = {}, bnf = [], i = 0, arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%4===3) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			cotzMoneda.compra = parseFloat(el);
			arrayIndex++;
		}else if((i+1)%4===0) {
			cotzMoneda.venta = parseFloat(el);
			bnf.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	return(bnf);
};

const getCotzBancoContinental = async () => {
	const monedaNames = ['USD','ARS','real','JPY','CHF','EUR','GBP','CAD','AUD','UYU'];
	let response = await axios.get('https://www.bancontinental.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('.cotizaciones>.container');
	cambiosArray.each(function () {
		$(this).find('b').each(function ()  {
			cambiosArraySplit.push($(this).text().trim().replace(".","").replace(",","."));
		});
	});
	cambiosArraySplit.splice(20,4);

	let cotzMoneda = {}, continental = [], i=0, arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%2===1) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			cotzMoneda.compra = parseFloat(el);
		}
		else{
			cotzMoneda.venta = parseFloat(el);
			continental.push(cotzMoneda);
			cotzMoneda = {};
			arrayIndex++;
		}
		i++;
	});
	return(continental);	
};

const getCotzBancoFamiliar = async () => {
	const monedaNames = ['USD','ARS','BRL','EUR'];
	let response = await axios.get('https://www.familiar.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('#cotizaciones>.container>.row');

	cambiosArray.each(function () {
		$(this).find('strong').each(function ()  {
			cambiosArraySplit.push($(this).text().trim().replace(".","").replace(",","."));
		});
	});
	cambiosArraySplit.splice(2,2);cambiosArraySplit.splice(8,2);

	let cotzMoneda = {}, familiar = [], i = 0, arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%2===1) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			cotzMoneda.compra = parseFloat(el);
			arrayIndex++;
		}else if((i+1)%2===0) {
			cotzMoneda.venta = parseFloat(el);
			familiar.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	return(familiar);
};

const getCotzBancoInterfisa = async () => {
	let response = await axios.get('https://www.interfisa.com.py/index.php');
	const html = response.data;
	const $ = cheerio.load(html);

	let bancoInterfisa = [];
	bancoInterfisa.push({
		"moneda":"USD",
		"compra":parseFloat($('#dolar_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#dolar_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	bancoInterfisa.push({
		"moneda":"EUR",
		"compra":parseFloat($('#euro_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#euro_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	bancoInterfisa.push({
		"moneda":"ARS",
		"compra":parseFloat($('#peso_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#peso_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	bancoInterfisa.push({
		"moneda":"BRL",
		"compra":parseFloat($('#real_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#real_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	return(bancoInterfisa);     
};

const getCotzBancoVision = async () => {
	const monedaNames = ['USD','BRL','ARS','EUR'];
	let response = await axios.get('https://www.visionbanco.com/');
	const html = response.data;
	const $ = cheerio.load(html);

	let  cambiosArraySplit = [], cambiosArray;
	cambiosArray = $('.table-bordered--min>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,"").toLowerCase().replace("compra","").replace("venta","").replace("ñ","n"));
		});
	});
	cambiosArraySplit.splice(12,9);
	
	let i = 0, cotzMoneda = {}, bancoVision = [], arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===1) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			arrayIndex++;
		}
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			bancoVision.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	return(bancoVision);
};
//#endregion
//*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
//#region CASAS DE CAMBIO
const getCotzCambiosBonanza = async () => {
	const monedaNames = ['USD','EUR','ARS','BRL'];
	let response = await axios.get('https://bonanzacambios.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let  cambiosArraySplit = [], cambiosArray;
	cambiosArray = $('.flat-pricing.style1>.container>.row>.col-md-12>.table-pricing.style1>table>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,"").toLowerCase().replace("compra","").replace("venta","").replace("ñ","n"));
		});
	});
	cambiosArraySplit.splice(23,96);
	let filteredArray = cambiosArraySplit.filter(function (el) {
		return el != "";
	});
		
	let i = 0, cotzMoneda = {}, bonanzaCambios = [], arrayIndex = 0;
	filteredArray.forEach((el) => {
		if((i+1)%3===1) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			arrayIndex++;
		}
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			bonanzaCambios.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	return(bonanzaCambios);
};

const getCotzCambiosChaco = async () => {
	const monedaNames = ['USD','BRL','ARS','EUR','CLP','UYU','COP','MXN','BOB','PEN','CAD','AUD','NOK','DKK','SEK','GBP','CHF','JPY','KWD','ILS','ZAR','RUB'];
	let cambiosChaco = [];
	let response = await axios.get('https://www.cambioschaco.com.py/');
		
	const html = response.data;
	const $ = cheerio.load(html);

	const cambiosArray = [];
	$('.cotiz-tabla>tbody>tr').each((i,el) => {
		cambiosArray.push($(el).find('td').text().trim());
	});

	let cambiosArraySplit = [], arrayIndex=0;
	cambiosArray.forEach(el => {
		let cotzMoneda = {};
		cambiosArraySplit = el.split(" ");
		let compraFlag = true, monedaNameFlag = true;
		cambiosArraySplit.forEach(el => {
			let parsedEl = parseFloat(el.replace(".","").replace(",","."));
			if(!isNaN(parsedEl)){
				if(compraFlag){
					cotzMoneda.compra = parsedEl;
					compraFlag = false;
				} 
				else {
					cotzMoneda.venta = parsedEl;
					monedaNameFlag = true;
				}
			}else{
				if(monedaNameFlag){
					cotzMoneda.moneda = monedaNames[arrayIndex];
					monedaNameFlag = false;
					arrayIndex++;
				}
			}
		});
		cambiosChaco.push(cotzMoneda);
		cotzMoneda = {};
		cambiosArraySplit = [];
	});
	cambiosChaco.splice(22,6);

	return(cambiosChaco);
};

const getCotzCambiosFe = async () => {
	const monedaNames = ['USD','EUR','ARS','BRL'];
	let response = await axios.get('http://www.fecambios.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let  cambiosArraySplit = [], cambiosArray, cotzMoneda = {}, feCambios = [], i=0;
	cambiosArray = $('.wrap-cotizacion>.sliprincip>div>ul>li');
	cambiosArray.each(function () {
		$(this).find('.right.s120.aligncenter').each(function ()  {
			cotzMoneda.moneda = monedaNames[i];
			cotzMoneda.compra = parseFloat($(this).find('.compra').text().replace(",00","").replace(".","").replace(",","."));
			cotzMoneda.venta = parseFloat($(this).find('.venta').text().replace(",00","").replace(".","").replace(",","."));
			i++;
			
			feCambios.push(cotzMoneda);
			cotzMoneda={};
		});
	});
	return(feCambios);
};

const getCotzCambiosLaMoneda = async () => {
	const monedaNames = ['USD','BRL','ARS','EUR'];
	let response = await axios.get('http://www.lamoneda.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let  cambiosArraySplit = [], cambiosArray;
	cambiosArray = $('#cotizaciones1>.container>.row>.col-lg-10.col-lg-offset-1.text-center.text>.row>.col-md-6.col-sm-6>.portfolio-item>table>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,"").toLowerCase().replace("compra","").replace("venta","").replace("ñ","n"));
		});
	});
	cambiosArraySplit.splice(16,12);
	
	let i = 0, cotzMoneda = {}, laMoneda = [], arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%4===2) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			arrayIndex++;
		}
		if((i+1)%4===3) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%4===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			laMoneda.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	return(laMoneda);
};

const getCotzCambiosMaxiCambios = async () => {
	let monedaNames = ['USD','ARS','BRL','UYU','EUR','GBP','JPY','CLP','ZAR','CNY','CAD','AUD','CHF','MXN','PEN','BOB','COP'];
	let maxiCambios =[];
	let ASU = [];
	let CDE =  [];
	let response = await axios.get('https://www.maxicambios.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray = [];
	$('.col-xs-12.shadow_exchange>.row').each((i,el) => {
		cambiosArray.push(removeAcento($(el).text().trim().replace(/\n/g,"").replace(/ /g,"")).replace("compra",",").replace("venta",","));
	});

	let cambiosArraySplit = [], arrayIndex = 0;
	cambiosArray.forEach(el => {
		let cotzMoneda = {};
		cambiosArraySplit = el.split(",");

		let compraFlag = true;
		cambiosArraySplit.forEach(el => {
			let parsedEl = parseFloat(el);
			if(!isNaN(parsedEl)){
				if(compraFlag){
					cotzMoneda.compra = parsedEl;
					compraFlag = false;
				} 
				else cotzMoneda.venta = parsedEl;
				
			}else{
				cotzMoneda.moneda = monedaNames[arrayIndex];
				arrayIndex++;
			}
		});
		ASU.push(cotzMoneda);

		cotzMoneda = {};
		cambiosArraySplit = [];
	});
	CDE = ASU.splice(17,6);
	monedaNames = ['USD','ARS','BRL','EUR'];
	let i=0;
	CDE.forEach(el =>{
		el.moneda = monedaNames[i];
		if(i<4) i++;
	});
	CDE.splice(4,2);

	maxiCambios.ASU = ASU;
	maxiCambios.CDE = CDE;

	return(maxiCambios);
};

const getCotzCambiosMercosur = async () => {
	const monedaNames = ['USD','BRL','EUR','ARS'];
	let response = await axios.get('https://2019.mercosurcambios.com/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('.table-responsive>table>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('th').each(function ()  {
			cambiosArraySplit.push($(this).text().trim());
		});
	});
	cambiosArraySplit.splice(25,111);
	cambiosArraySplit.splice(10,5);

	let cotzMoneda = {}, mercosurCambios = [], i=0, arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%5===1) cotzMoneda.moneda = monedaNames[arrayIndex];
		else if((i+1)%5===0) {
			cotzMoneda.venta = parseFloat(el);
			mercosurCambios.push(cotzMoneda);
			cotzMoneda = {};
			arrayIndex++;
		}else if((i+1)%5===4) cotzMoneda.compra = parseFloat(el);

		i++;
	});
	return(mercosurCambios);	
};

const getCotzCambiosMundial = async () => {
	let mundialcambios = [];
	let ASU = [];
	let CDE = [];

	//ASU
	let response = await axios.get('https://mundialcambios.com.py/?branch=6&lang=es');
	let html = response.data;
	let $ = cheerio.load(html);

	let  cambiosArraySplit = [], cambiosArray;
	cambiosArray = $('.w-dyn-item>.w-row');
	cambiosArray.each(function () {
		$(this).find('.w-col.w-col-4.w-col-small-4.w-col-tiny-4').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,""));
		});
	});
	cambiosArraySplit.splice(0,3);
	
	let i = 0, cotzMoneda = {};
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = el;
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			ASU.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	
	//CDE
	response = await axios.get('http://mundialcambios.com.py/?branch=1&lang=es');
	html = response.data;
	$ = cheerio.load(html);

	cambiosArraySplit = [];
	cambiosArray = $('.w-dyn-item>.w-row');
	cambiosArray.each(function () {
		$(this).find('.w-col.w-col-4.w-col-small-4.w-col-tiny-4').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,""));
		});
	});
	cambiosArraySplit.splice(0,3);
	
	i = 0; cotzMoneda = {};
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = el;
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			CDE.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});

	mundialcambios.ASU = ASU;
	mundialcambios.CDE = CDE;

	return(mundialcambios);
};

const getCotzCambiosMYD = async () => {
	let monedaNames = ['USD','EUR','BRL','ARS','CLP','GBP','CAD','CHF','JPY','UYU'];
	let response = await axios.get('https://www.mydcambios.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosMyd = [];
	let ASU = [];
	let CDE =[];
	let cambiosArraySplit = [], cambiosArray;
	cambiosArray = $('.cambios-banner-text.scrollbox>ul');
	cambiosArray.each(function () {
		$(this).find('li').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,""));
		});
	});

	cambiosArraySplit.splice(0,60);
	let cambiosArraySplitCDE = cambiosArraySplit.splice(30,77);

	let i = 0, cotzMoneda = {};
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = monedaNames[(i/3)];
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el);
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el);
			ASU.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	cambiosArraySplitCDE.splice(0,3);cambiosArraySplitCDE.splice(2,3);
	monedaNames = ['USD','BRL','ARS','EUR','GBP','UYU']; i = 0;
	cambiosArraySplitCDE.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = monedaNames[(i/3)];
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el);
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el);
			CDE.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});

	cambiosMyd.ASU = ASU;
	cambiosMyd.CDE = CDE;
	return(cambiosMyd);
};

const getCotzCambiosPanorama = async () => {
	const monedaNames = ['USD','BRL','EUR','ARS'];
	let response = await axios.get('https://panoramacambios.com/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('.toggled-item>.rate-info-separator>.rate-tables>.rate-table-wrapper>table');
	cambiosArray.each(function () {
		$(this).find('tbody>tr>td').each(function ()  {
			cambiosArraySplit.push($(this).text().trim());
		});
	});
	cambiosArraySplit.splice(0,6);cambiosArraySplit.splice(10,42);cambiosArraySplit.splice(4,2);
	
	let cotzMoneda = {}, panoramaCambios = [], i=0, arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%2===1) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			cotzMoneda.compra = parseFloat(el);
		}
		else{
			cotzMoneda.venta = parseFloat(el);
			panoramaCambios.push(cotzMoneda);
			cotzMoneda = {};
			arrayIndex++;
		}
		i++;
	});
	return(panoramaCambios);	
};

const getCotzCambiosRioParana = async () => {
	const monedaNames = ['USD','EUR','ARS','BRL'];
	let response = await axios.get('https://www.cambiosrioparana.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('#content_sucursales>.col-lg-6.col-md-6.col-sm-6.col-xs-12>.block>.listaMoneda');
	cambiosArray.each(function () {
		$(this).find('li').each(function ()  {
			$(this).find('.col-lg-3.col-md-3.col-sm-3.col-xs-4').each(function ()  {
				cambiosArraySplit.push($(this).text().replace(",00","").replace(".","").replace(",",".").trim());
			});
		});
	});
	cambiosArraySplit.splice(8,64);

	let cotzMoneda = {}, rioParana = [], i=0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%2===0) {
			cotzMoneda.venta = el;
			rioParana.push(cotzMoneda);
			cotzMoneda = {};
		}else if((i+1)%2===1) {
			cotzMoneda.moneda = monedaNames[i/2];
			cotzMoneda.compra = el;
		}
		i++;
	});
	return(rioParana);
};

const getCotzCambiosYrendague = async () => {
	const monedaNames = ['USD','BRL','ARS','EUR'];
	let response = await axios.get('https://www.yrendague.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('#suc_2>.cotacao-box>.conteudo>table>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push($(this).text().trim().replace(".","").replace(",","."));
		});
	});
	cambiosArraySplit.splice(12,15);

	let cotzMoneda = {}, yrendague = [], i=0, arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===2) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			cotzMoneda.compra = parseFloat(el);
		}
		else if((i+1)%3===0){
			cotzMoneda.venta = parseFloat(el);
			yrendague.push(cotzMoneda);
			cotzMoneda = {};
			arrayIndex++;
		}
		i++;
	});
	return(yrendague);	
};

const getCotzCambiosZafra = async () => {
	const monedaNames = ['USD','BRL','EUR','ARS'];
	zafraCambios = [];
	let ASU = [];
	let CDE = [];
	let response = await axios.get('https://zafracambios.com.py/');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('.img-bg.col-xs-12.col-md-6>.cotacao-box>.conteudo>.table-cotacao>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push(removeAcento($(this).text().replace(/\s/g,"").replace(".","").replace(",",".").toLowerCase()).replace("xguaranies","").replace("peso","ARS"));
		});
	});
	let cambiosArraySplitCDE = cambiosArraySplit.splice(0,21);cambiosArraySplit.splice(12,105);

	let cotzMoneda = {}, i = 0, arrayIndex = 0;
	cambiosArraySplit.forEach((el) => {
		let parsedEl = parseFloat(el);
		if((i+1)%3===1) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			arrayIndex++;
		}
		if((i+1)%3===2) cotzMoneda.compra = parsedEl;
		if((i+1)%3===0) {
			cotzMoneda.venta = parsedEl;
			ASU.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});

	cotzMoneda = {}; i = 0; arrayIndex = 0;
	cambiosArraySplitCDE.splice(12,9);
	cambiosArraySplitCDE.forEach((el) => {
		let parsedEl = parseFloat(el);
		if((i+1)%3===1) {
			cotzMoneda.moneda = monedaNames[arrayIndex];
			arrayIndex++;
		}
		if((i+1)%3===2) cotzMoneda.compra = parsedEl;
		if((i+1)%3===0) {
			cotzMoneda.venta = parsedEl;
			CDE.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});

	zafraCambios.ASU = ASU;
	zafraCambios.CDE = CDE;

	return(zafraCambios);
};
//#endregion 
//*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
//#region OTROS
const getCotzBCP = async () => {
	const agent = new https.Agent({  
		rejectUnauthorized: false
	});
	let response = await axios.get('https://www.bcp.gov.py/webapps/web/cotizacion/monedas', { httpsAgent: agent });
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('#cotizacion-interbancaria>tbody>tr');

	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push($(this).text().trim().replace(".","").replace(",","."));
		});
	});

	let cotzMoneda = {}, bcp = [], i = 0;
	cambiosArraySplit.forEach((el) => {
		if((i+1)%4===2) cotzMoneda.moneda = el;
		else if((i+1)%4===0) {
			cotzMoneda.venta = parseFloat(el);
			bcp.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	return(bcp);	
};

const getCotzSET = async () => {
	let response = await axios.get('https://www.set.gov.py/portal/PARAGUAY-SET');
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray = [];
	$('table.UITable>tbody>tr>td.UICotizacion>p').each((i,el) => {
		cambiosArray.push($(el).text().replace(/\s/g,"").replace(/[.]/g,"").replace("G",""));
	});

	let set = [];
	set.push({
		"moneda":"USD",
		"compra":parseFloat(cambiosArray[0]),
		"venta":parseFloat(cambiosArray[1])
	});

	return(set);     
};
//#endregion 
//*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*


const getCotizaciones = async () => {
	//CASAS DE CAMBIO
	console.log('cambiosBonanza');
	console.log(await getCotzCambiosBonanza());
	console.log('cambiosChaco');
	console.log(await getCotzCambiosChaco());
	console.log('CambiosFe');
	console.log(await getCotzCambiosFe());
	console.log('CambiosLaMoneda');
	console.log(await getCotzCambiosLaMoneda());
	console.log('cambiosMaxiCambios');
	console.log(await getCotzCambiosMaxiCambios());
	console.log('CambiosMercosur');
	console.log(await getCotzCambiosMercosur());
	console.log('CambiosMundial');
	console.log(await getCotzCambiosMundial());
	console.log('CambiosMYD');
	console.log(await getCotzCambiosMYD());
	console.log('CambiosPanorama');
	console.log(await getCotzCambiosPanorama());
	//console.log('CambiosRioParana');
	//console.log(await getCotzCambiosRioParana());
	console.log('CambiosYrendague');
	console.log(await getCotzCambiosYrendague());
	console.log('CambiosZafra');
	console.log(await getCotzCambiosZafra());
	//BANCOS
	console.log('BancoBASA');
	console.log(await getCotzBancoBASA());
	console.log('BancoBNF');
	console.log(await getCotzBancoBNF());
	console.log('BancoContinental');
	console.log(await getCotzBancoContinental());
	console.log('BancoFamiliar');
	console.log(await getCotzBancoFamiliar());
	console.log('BancoInterfisa');
	console.log(await getCotzBancoInterfisa());
	console.log('BancoVision');
	console.log(await getCotzBancoVision());
	//OTROS
	console.log('BCP');
	console.log(await getCotzBCP());
	console.log('SET');
	console.log(await getCotzSET());

};

getCotizaciones();