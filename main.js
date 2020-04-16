console.log('Loading ... \n')
const Twit = require('twit')
const axios = require('axios');
 
var T = new Twit({
  consumer_key:         'qDgZNWtBdYwg4JvnVXZ5qgK2x',
  consumer_secret:      'ZETbdusPXWNRUlWP2L3pxSBmlul4kvCzK7A8iL3F1fDFr8aGpM',
  access_token:         '1250596373864624128-9K2lW5AJi4Ye4whfNal41bJmiBjnzR',
  access_token_secret:  '7TL3eJzXKIVf2Nv7DiGUl6EoUm5WmwgdgzRf98AsoQdlf',
})


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

			todayDay = today.getUTCDate()
			dateDay = date.getUTCDate()

			if((date.getUTCHours()-3) < 0){
				dateDay = date.getUTCDate()-1
			}

			if((today.getUTCHours()-3) < 0){
				todayDay = today.getUTCDate()-1
			}
			
			if((dateDay) == (todayDay)){

				title = filterString.split(`<h2>`)
				title = title[1].split(`</h2>`)
				title = String(title[0])
				
				let startHours = date.getUTCHours()-3
				startHours == -3 ? startHours = 21 : null
				startHours == -2 ? startHours = 22 : null
				startHours == -1 ? startHours = 23 : null
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

				let start = `${startHours}:${startMinutes}`

				date = new Date(dataEndTime * 1000)
				
				let endHours = date.getUTCHours()-3
				endHours == -3 ? endHours = 21 : null
				endHours == -2 ? endHours = 22 : null
				endHours == -1 ? endHours = 23 : null
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
				
				let end = `${endHours}:${endMinutes}`

				
				list.push({ title, start, end })
			}
			
		}
	}

	return list
	
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function PostTweet(){

	while(true){

		today = new Date()

		todayDay = today.getUTCDay()
		if((today.getUTCHours()-3) < 0){
			todayDay = today.getUTCDay()-1
			if(todayDay < 0){
				todayDay = 6
			}
		}

		if(todayDay == 0){
			weekDay = 'Domingo'
		}
		if(todayDay == 1){
			weekDay = 'Segunda-feira'
		}
		if(todayDay == 2){
			weekDay = 'Terça-feira'
		}
		if(todayDay == 3){
			weekDay = 'Quarta-feira'
		}
		if(todayDay == 4){
			weekDay = 'Quinta-feira'
		}
		if(todayDay == 5){
			weekDay = 'Sexta-feira'
		}
		if(todayDay == 6){
			weekDay = 'Sábado'
		}


		await AxiosRequest().then(async function (response){ 
		
			var part1 = [`Programação da Globo MG de hoje (${weekDay}): \n\n`]
			var part2 = ['Continuação: \n\n']
			var part3 = ['Continuação: \n\n']
			
			divided = parseInt(parseInt(response.length) / 3)
			all = parseInt(response.length)
		
			for(i = 0; i <= divided; i++){
				part1.push(`${response[i].start} : ${response[i].title}\n`) 
			}
		
			for(j = (divided+1); j <= (divided * 2); j++){
				part2.push(`${response[j].start} : ${response[j].title}\n`)
			}
		
			for(k = (divided*2+1); k <= (all-1); k++){
				part3.push(`${response[k].start} : ${response[k].title}\n`)
			}
		
			part1 = part1.join('')
			part2 = part2.join('')
			part3 = part3.join('')
		
			T.post('statuses/update', { 
		
				status: part1
				
			}, function(err, data, response) {
		
				console.log(err)
				part1Id = data.id_str
				
				if(!err){
					T.post('statuses/update', { 
						
						status: part2,
						in_reply_to_status_id: '' + part1Id
						
					}, function(err, data, response) {
						
						console.log(err)
						part2Id = data.id_str
						T.post('statuses/update', { 
				
							status: part3,
							in_reply_to_status_id: '' + part2Id
							
						}, function(err){
							console.log(err)
						})
					})
				}
			})
		
		})

		console.log('Waiting ...')
		await timeout(86400000)

	}
}

PostTweet()