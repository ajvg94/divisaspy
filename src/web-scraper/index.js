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
	axios.get('https://www.bbva.com.py/public/')
	.then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
		const tabla = $('#quotation-table > tbody > tr');

		const topPremierLeagueScorers = [];

        tabla.each(function () {
			const rank = $(this).find('.number').text();
			const playerName = $(this).find('.playerName > strong').text();
			const nationality = $(this).find('.playerCountry').text();
			const goals = $(this).find('.mainStat').text();

			topPremierLeagueScorers.push({
				rank,
				name: playerName,
				nationality,
				goals,
			});
		});

	})
	.catch(console.error);
};

getHTML();