/*
->CAMBIOS CHACO
->MAXICAMBIOS
->SET
->INTERFISA
->AMAMBAY o BASA
->MYD CAMBIOS
->MUNDIAL CAMBIOS
->VISIÓN BANCO
->La Moneda Cambios S.A.
->Bonanza Cambios
->FE CAMBIOS
->zafra cambios
//->cambios rio parana comentado porque esta desactualizado
->mercosur cambios
->panorama cambios
cambios yrendague
banco continental
BNF
banco atlas
banco familiar
BCP https://www.bcp.gov.py/webapps/web/cotizacion/monedas
BBVA
EURO CAMBIOS
CAMBIOS ALBERDI
norte cambios
*/
const axios = require('axios');
const cheerio = require('cheerio');

const removeAcento = (text) =>{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
}

const getCotzCambiosChaco = async () => {
	let cambiosChaco = [];
	let response = await axios.get('https://www.cambioschaco.com.py/')
		
	const html = response.data;
	const $ = cheerio.load(html);

	const cambiosArray = [];
	$('.cotiz-tabla>tbody>tr').each((i,el) => {
		cambiosArray.push($(el).find('td').text().trim());
	});
	//console.log(JSON.stringify(cambiosArray));

	let cambiosArraySplit = [];
	cambiosArray.forEach(el => {
		let cotzMoneda = {};
		cambiosArraySplit = el.split(" ");
		//console.log(JSON.stringify(cambiosArraySplit));

		let compraFlag = monedaNameFlag = true;
		cambiosArraySplit.forEach(el => {
			let parsedEl = parseFloat(el.replace(".","").replace(",","."));
			if(!isNaN(parsedEl)){
				if(compraFlag){
					cotzMoneda.compra = parsedEl;
					compraFlag = false;
				} 
				else cotzMoneda.venta = parsedEl;
				
			}else{
				if(monedaNameFlag){
					cotzMoneda.moneda = el;
					monedaNameFlag = false;
				}else cotzMoneda.moneda += " "+(el);
			}
		});
		//console.log(JSON.stringify(cotzMoneda));
		cotzMoneda.moneda = cotzMoneda.moneda.trim();
		cambiosChaco.push(cotzMoneda);

		cotzMoneda = {};
		cambiosArraySplit = [];
	});
	cambiosChaco.splice(22,6);
	// console.log("cambiosChaco:");
	// console.log(cambiosChaco);
}
getCotzCambiosChaco();

const getCotzMaxiCambios = async () => {
	let maxiCambios = [];
	let response = await axios.get('https://www.maxicambios.com.py/')
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray = [];
	$('.col-xs-12.shadow_exchange>.row').each((i,el) => {
		cambiosArray.push(removeAcento($(el).text().trim().replace(/\n/g,"").replace(/ /g,"")).replace("compra",",").replace("venta",","));
	});
	//console.log(JSON.stringify(cambiosArray));

	let cambiosArraySplit = [];
	cambiosArray.forEach(el => {
		let cotzMoneda = {};
		cambiosArraySplit = el.split(",");
		//console.log(JSON.stringify(cambiosArraySplit));

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
				cotzMoneda.moneda = el.replace(/[.]/g,"");
			}
		});
		//console.log(JSON.stringify(cotzMoneda));
		maxiCambios.push(cotzMoneda);

		cotzMoneda = {};
		cambiosArraySplit = [];
	});
	maxiCambios.splice(17,6);
	// console.log("maxiCambios:");
	// console.log(maxiCambios);
}
getCotzMaxiCambios();

const getCotzSET = async () => {
	let response = await axios.get('https://www.set.gov.py/portal/PARAGUAY-SET')
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray = [];
	$('table.UITable>tbody>tr>td.UICotizacion>p').each((i,el) => {
		cambiosArray.push($(el).text().replace(/\s/g,"").replace(/[.]/g,"").replace("G",""));
	});
	//console.log(JSON.stringify(cambiosArray));

	let set = [];
	set.push({
		"moneda":"dolar",
		"compra":parseFloat(cambiosArray[0]),
		"venta":parseFloat(cambiosArray[1])
	});
	// console.log("SET:");
	// console.log(set);     
}
getCotzSET();

const getCotzInterfisa = async () => {
	let response = await axios.get('https://www.interfisa.com.py/index.php')
	const html = response.data;
	const $ = cheerio.load(html);

	let interfisa = [];
	interfisa.push({
		"moneda":"dolar",
		"compra":parseFloat($('#dolar_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#dolar_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	interfisa.push({
		"moneda":"euro",
		"compra":parseFloat($('#euro_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#euro_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	interfisa.push({
		"moneda":"pesoArg",
		"compra":parseFloat($('#peso_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#peso_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	interfisa.push({
		"moneda":"real",
		"compra":parseFloat($('#real_compra').text().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#real_venta').text().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	// console.log("interfisa:");
	// console.log(interfisa);     
}
getCotzInterfisa();

const getCotzBASA = async () => {
	let response = await axios.get('https://www.bancobasa.com.py/')
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, basa = [];
	cambiosArray = $('ul.trendscontent>li>a.search_link');
	cambiosArray.each(function () {
		let cotzMoneda = {};
		cotzMoneda.moneda = $(this).find('span.descripcion').text();
		cotzMoneda.compra = parseFloat($(this).find('span.compra').text());
		cotzMoneda.venta = parseFloat($(this).find('span.venta').text());
		basa.push(cotzMoneda);
	});
	// console.log("basa:");
	// console.log(basa);
}
getCotzBASA();

const getCotzMYD = async () => {
	const monedaNames = ['dolar','euro','real','pesoArg','pesoChi','libra','dolarCan','francoSui','yen','pesoUru'];
	let response = await axios.get('https://www.mydcambios.com.py/')
	const html = response.data;
	const $ = cheerio.load(html);

	let myd = [], cambiosArraySplit = [], cambiosArray;
	cambiosArray = $('.cambios-banner-text.scrollbox>ul');
	cambiosArray.each(function () {
		$(this).find('li').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,""));
		});
	});
	
	cambiosArraySplit.splice(0,60);cambiosArraySplit.splice(30,77);
	let i = 0, cotzMoneda = {};
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = monedaNames[(i/3)];
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el);
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el);
			myd.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	// console.log("myd:");
	// console.log(myd);
}
getCotzMYD();

const getCotzMundialCambios = async () => {
	let response = await axios.get('https://mundialcambios.com.py/?branch=6&lang=es')
	const html = response.data;
	const $ = cheerio.load(html);

	let  cambiosArraySplit = [], cambiosArray;
	cambiosArray = $('.w-dyn-item>.w-row');
	cambiosArray.each(function () {
		$(this).find('.w-col.w-col-4.w-col-small-4.w-col-tiny-4').each(function ()  {
			cambiosArraySplit.push($(this).text().replace(/\s/g,""));
		});
	});
	cambiosArraySplit.splice(0,3);
	
	let i = 0, mundialcambios = [], cotzMoneda = {};
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = el;
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			mundialcambios.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	// console.log("mundialcambios:");
	// console.log(mundialcambios);
}
getCotzMundialCambios();

const getCotzBancoVision = async () => {
	let response = await axios.get('https://www.visionbanco.com/')
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
	
	let i = 0, cotzMoneda = {}, bancoVision = [];
	cambiosArraySplit.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = el;
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			bancoVision.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	// console.log("bancoVision:");
	// console.log(bancoVision);
}
getCotzBancoVision();

const getCotzLaMoneda = async () => {
	let response = await axios.get('http://www.lamoneda.com.py/')
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
	
	let i = 0, cotzMoneda = {}, laMoneda = [];
	cambiosArraySplit.forEach((el) => {
		if((i+1)%4===2) cotzMoneda.moneda = el;
		if((i+1)%4===3) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%4===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			laMoneda.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	// console.log("laMoneda:");
	// console.log(laMoneda);
}
getCotzLaMoneda();

const getCotzBonanzaCambios = async () => {
	let response = await axios.get('https://bonanzacambios.com.py/')
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
		
	let i = 0, cotzMoneda = {}, bonanzaCambios = [];
	filteredArray.forEach((el) => {
		if((i+1)%3===1) cotzMoneda.moneda = el;
		if((i+1)%3===2) cotzMoneda.compra = parseFloat(el.replace(".","").replace(",","."));
		if((i+1)%3===0) {
			cotzMoneda.venta = parseFloat(el.replace(".","").replace(",","."));
			bonanzaCambios.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});
	// console.log("bonanzaCambios:");
	// console.log(bonanzaCambios);
}
getCotzBonanzaCambios();

const getCotzFeCambios = async () => {
	const monedaNames = ['dolar','euro','pesoArg','real'];
	let response = await axios.get('http://www.fecambios.com.py/')
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

	// console.log("feCambios:");
	// console.log(feCambios);
}
getCotzFeCambios();

const getCotzZafraCambios = async () => {
	let response = await axios.get('https://zafracambios.com.py/')
	const html = response.data;
	const $ = cheerio.load(html);

	let cambiosArray, cambiosArraySplit = [];
	cambiosArray = $('.img-bg.col-xs-12.col-md-6>.cotacao-box>.conteudo>.table-cotacao>tbody>tr');
	cambiosArray.each(function () {
		$(this).find('td').each(function ()  {
			cambiosArraySplit.push(removeAcento($(this).text().replace(/\s/g,"").replace(".","").replace(",",".").toLowerCase()).replace("xguaranies","").replace("peso","pesoArg"));
		});
	});
	cambiosArraySplit.splice(0,21);cambiosArraySplit.splice(12,105);

	let cotzMoneda = {}, zafraCambios = [], i=0;
	cambiosArraySplit.forEach((el) => {
		let parsedEl = parseFloat(el);
		if((i+1)%3===1) cotzMoneda.moneda = el;
		if((i+1)%3===2) cotzMoneda.compra = parsedEl;
		if((i+1)%3===0) {
			cotzMoneda.venta = parsedEl;
			zafraCambios.push(cotzMoneda);
			cotzMoneda = {};
		}
		i++;
	});

	// console.log("zafraCambios:");
	// console.log(zafraCambios);
}
getCotzZafraCambios();

// const getCotzRioParana = async () => {
// 	const monedaNames = ['dolar','euro','pesoArg','real'];
// 	let response = await axios.get('https://www.cambiosrioparana.com.py/');
// 	const html = response.data;
// 	const $ = cheerio.load(html);

// 	let cambiosArray, cambiosArraySplit = [];
// 	cambiosArray = $('#content_sucursales>.col-lg-6.col-md-6.col-sm-6.col-xs-12>.block>.listaMoneda');
// 	cambiosArray.each(function () {
// 		$(this).find('li').each(function ()  {
// 			$(this).find('.col-lg-3.col-md-3.col-sm-3.col-xs-4').each(function ()  {
// 				cambiosArraySplit.push($(this).text().replace(",00","").replace(".","").replace(",",".").trim());
// 			});
// 		});
// 	});
// 	cambiosArraySplit.splice(8,64);

// 	let cotzMoneda = {}, rioParana = [], i=0;
// 	cambiosArraySplit.forEach((el) => {
// 		if((i+1)%2===0) {
// 			cotzMoneda.venta = el;
// 			rioParana.push(cotzMoneda);
// 			cotzMoneda = {};
// 		}else if((i+1)%2===1) {
// 			cotzMoneda.moneda = monedaNames[i/2];
// 			cotzMoneda.compra = el;
// 		}
// 		i++;
// 	});

// 	// console.log("rioParana:");
// 	// console.log(rioParana);
	
// }
// getCotzRioParana();

const getCotzMercosurCambios = async () => {
	const monedaNames = ['dolar','real','euro','pesoArg'];
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

	// console.log("mercosurCambios:");
	// console.log(mercosurCambios);	
}
getCotzMercosurCambios();

const getCotzPanoramaCambios = async () => {
	const monedaNames = ['dolar','real','euro','pesoArg'];
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

	// console.log("panoramaCambios:");
	// console.log(panoramaCambios);	
}
getCotzPanoramaCambios();