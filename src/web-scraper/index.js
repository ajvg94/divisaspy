/*
->CAMBIOS CHACO
CAMBIOS ALBERDI
->MAXICAMBIOS
->SET
->INTERFISA
AMAMBAY
MYD CAMBIOS
BBVA
EURO CAMBIOS
MUNDIAL CAMBIOS
VISIÓN BANCO
La Moneda Cambios S.A.
Bonanza Cambios
FE CAMBIOS
zafra cambios
cambios parana
mercosur cambios
panorama cambios
cambios yrendague
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

const getCotzMaxiCambios= async () => {
	let maxiCambios = [];
	let response = await axios.get('https://www.maxicambios.com.py/')
	const html = response.data;
	const $ = cheerio.load(html);

	const cambiosArray = [];
	$('.col-xs-12.shadow_exchange>.row').each((i,el) => {
		cambiosArray.push(removeAcento($(el).text().toString().trim().replace(/\n/g,"").replace(/ /g,"")).replace("compra",",").replace("venta",","));
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

const getCotzSET= async () => {
	
	let response = await axios.get('https://www.set.gov.py/portal/PARAGUAY-SET')
	const html = response.data;
	const $ = cheerio.load(html);

	const cambiosArray = [];
	$('table.UITable>tbody>tr>td.UICotizacion>p').each((i,el) => {
		cambiosArray.push($(el).text().toString().replace(/\s/g,"").replace(/[.]/g,"").replace("G",""));
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


const getCotzInterfisa= async () => {
	
	let response = await axios.get('https://www.interfisa.com.py/index.php')
	const html = response.data;
	const $ = cheerio.load(html);

	let interfisa = [];
	interfisa.push({
		"moneda":"dolar",
		"compra":parseFloat($('#dolar_compra').text().toString().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#dolar_venta').text().toString().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	interfisa.push({
		"moneda":"euro",
		"compra":parseFloat($('#euro_compra').text().toString().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#euro_venta').text().toString().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	interfisa.push({
		"moneda":"pesoArg",
		"compra":parseFloat($('#peso_compra').text().toString().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#peso_venta').text().toString().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	interfisa.push({
		"moneda":"real",
		"compra":parseFloat($('#real_compra').text().toString().replace(/[.]/g,"").replace(/[,]/g,".")),
		"venta":parseFloat($('#real_venta').text().toString().replace(/[.]/g,"").replace(/[,]/g,"."))
	});
	// console.log("interfisa:");
	// console.log(interfisa);     
}
getCotzInterfisa();
