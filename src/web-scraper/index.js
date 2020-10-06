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

const getHTML = async () => {
	try {
		const data = await axios.get('https://www.bbva.com.py/public/');
		const $ = cheerio.load(data);
		const postTitles = [];

		$('#quotation-table-div').each((_idx, el) => {
			const postTitle = $(el).text()
			postTitles.push(postTitle)
		});

		return postTitles;
	} catch (error) {
		throw error;
	}
};

getHTML()
.then((postTitles) => console.log(postTitles));