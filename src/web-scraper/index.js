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
	axios.get('https://www.cambioschaco.com.py/')
		.then(response => {
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
			console.log(cambiosChaco);
		})
		.catch(console.error);
}

getCotzCambiosChaco();

const getCotzMaxiCambios= async () => {
	let maxiCambios = [];
	axios.get('https://www.maxicambios.com.py//share')
		.then(response => {
			const html = response.data;
			const $ = cheerio.load(html);

			const cambiosArray = [];
			$('cotizDivSmall col-xs-12 col-sm-6 col-md-6 col-lg-6 ng-tns-c4-0 ng-star-inserted').each((i,el) => {
				cambiosArray.push($(el).text().trim());
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
			console.log(cambiosChaco);
		})
		.catch(console.error);
}
getCotzMaxiCambios();


