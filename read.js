
const cheerio = require('cheerio')

var log = function() {
	console.log.apply(console, arguments)
}

var dataSaved = function() {
	this.Data = []
	this.Html = ''
}

var data = new dataSaved()

var loadTheJob = function() {
	var fs = require('fs')
	var path = 'JavaScript.txt'
	return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

var loadTheHtml = function() {
	var fs = require('fs')
	var path = 'JavaScript职位.html'
	return fs.readFileSync(path, 'utf-8')
}

// data.Data = loadTheJob()
// log(data.Data[0].jobName)

var htmlTemplate = function(ob, id) {
	var tem = `
		<div class='jobData-container' data-id='${id}'>
			<div class='job-company-description'>
				${ob.company}
			</div>
			<h2>${ob.jobName}</h2>
			<div class='job-request'>
				${ob.jobRequest}
			</div>
			<div class='job-description'>
				${ob.jobDescription}
			</div>
			<p><a href="${ob.url}">访问</a></p>
		</div>
	`
	return tem
}

var insertHtml = function(test, id) {
	data.Html = loadTheHtml()
	var h = cheerio.load(data.Html)
	var body = h('body')
	var tem = htmlTemplate(test, id)
	body.append(tem)
	log('测试获取html', body.html())
	// log(data.Html)


}

var showData = function() {
	data.Data = loadTheJob()
	insertHtml(data.Data[0], 0)
	
}

showData()