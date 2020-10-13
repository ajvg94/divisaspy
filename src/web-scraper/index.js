/*
->CAMBIOS CHACO
CAMBIOS ALBERDI
MAXICAMBIOS
SET
INTERFISA
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
const e = require('express');
const { json } = require('express');

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
	//console.log(cambiosChaco);
}

getCotzCambiosChaco();

const getCotzMaxiCambios= async () => {
	let maxiCambios = [];
	let response = await axios.get('https://www.maxicambios.com.py/')
	const html = response.data;
	const $ = cheerio.load(html);

	const cambiosArray = [];
	$('.col-xs-12.shadow_exchange>.row').each((i,el) => {
		cambiosArray.push($(el).text().toString().trim().replace(/\n/g,"").replace(/ /g,""));
	});
	console.log(JSON.stringify(cambiosArray));

	/*cambiosArray.forEach(el => {
		el = el.replace("\\n","").replace(" ","");
	});
	console.log(JSON.stringify(cambiosArray));*/

	/*let cambiosArraySplit = [];
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
	console.log(cambiosChaco);*/
}
getCotzMaxiCambios();


