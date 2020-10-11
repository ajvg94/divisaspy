/*
CAMBIOS CHACO
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
const { json } = require('express');

const getHTML = async () => {
	axios.get('https://www.cambioschaco.com.py/')
	.then(response => {
		const html = response.data;
		const $ = cheerio.load(html);

		let cambiosArray = [];

        $('table table-hover cotiz-tabla>tbody>tr>td').each((i,el) => {
			cambiosArray.push($(el).find('.number').text());
		});

		console.log(JSON.stringify(cambiosArray));
	})
	.catch(console.error);
};

getHTML();