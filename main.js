console.log('Loading ... \n')
const axios = require('axios');

var today = new Date()

async function AxiosRequest(){
	let response = await axios.get("https://redeglobo.globo.com/globominas/programacao/")
	let data = response.data
	
	var arrayHtml = data.split(`<div class="schedule-item-header-info">`)
	var filter = arrayHtml.filter(index => index.includes("</div>"))

	filterArray = []
	for(i in filter){
		filterArray[i] = filter[i].split('</div>')
	}

	list = []

	for(i in filterArray){
		if(filterArray[i][0].includes("<h2>")){

			filterString = filterArray[i][0]

			dataStartTime = filterString.split(`data-start-time="`)
			dataStartTime = dataStartTime[1].split(`" data-end-time="`)
			dataStartTime = parseInt(dataStartTime[0])

			dataEndTime = filterString.split(`data-end-time="`)
			dataEndTime = dataEndTime[1].split(`" data-timezone="`)
			dataEndTime = parseInt(dataEndTime[0])

			date = new Date(dataStartTime * 1000)

			if((date.getDate()) == (today.getDate())){
				title = filterString.split(`<h2>`)
				title = title[1].split(`</h2>`)
				title = String(title[0])

				let startHours = date.getUTCHours()-3
				if((String(startHours).length) == 1 ){
					startHours = `0${startHours}`
				}

				let startMinutes = date.getMinutes()
				if((String(startMinutes).length) == 1 ){
					startMinutes = `0${startMinutes}`
				}

				let startSeconds = date.getSeconds()
				if((String(startSeconds).length) == 1 ){
					startSeconds = `0${startSeconds}`
				}

				let start = `${startHours}:${startMinutes}:${startSeconds}`

				date = new Date(dataEndTime * 1000)

				let endHours = date.getUTCHours()-3
				if((String(endHours).length) == 1 ){
					endHours = `0${endHours}`
				}

				let endMinutes = date.getMinutes()
				if((String(endMinutes).length) == 1 ){
					endMinutes = `0${endMinutes}`
				}

				let endSeconds = date.getSeconds()
				if((String(endSeconds).length) == 1 ){
					endSeconds = `0${endSeconds}`
				}

				let end = `${endHours}:${endMinutes}:${endSeconds}`


				list.push({ title, start, end })
			}

		}
	}

	return list

}

AxiosRequest().then(res => console.log(res))

// var res = [
// 	{ title: 'Hora Um', hours: '04:00' },
// 	{ title: 'Bom Dia Minas', hours: '06:00' },
// 	{ title: 'Bom Dia Brasil', hours: '08:30' },
// 	{ title: 'Combate ao Coronavírus', hours: '10:00' },
// 	{ title: 'MG1', hours: '12:00' },
// 	{ title: 'Jornal Hoje', hours: '13:25' },
// 	{ title: 'Sessão da Tarde - Casamento Grego 2', hours: '14:56' },
// 	{ title: 'Vale a Pena Ver de Novo - Avenida Brasil', hours: '16:39' },
// 	{ title: 'Malhação - Viva a Diferença', hours: '17:51' },
// 	{ title: 'Novo Mundo', hours: '18:26' },
// 	{ title: 'MG2', hours: '19:03' },
// 	{ title: 'Totalmente Demais', hours: '19:34' },
// 	{ title: 'Jornal Nacional', hours: '20:30' },
// 	{ title: 'Fina Estampa', hours: '21:36' },
// 	{ title: 'Big Brother Brasil 20', hours: '22:41' },
// 	{ title: 'Cinema Especial - Vai Que Cola - O Filme', hours: '23:15' },
// 	{ title: 'Jornal da Globo', hours: '00:37' },
// 	{ title: 'Perception: Truques da Mente ', hours: '01:33' },
// 	{ title: 'Corujão I - Uma Canção', hours: '02:20' }
//   ]

// for(i in res){
// 	console.log(res[i].title)
// }