
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
	var path = 'db/Web前端.txt'
	return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

var loadTheHtml = function() {
	var fs = require('fs')
	var path = '可视化html/Web前端职位.html'
	return fs.readFileSync(path, 'utf-8')
}

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
		<hr />
	`
	return tem
}

var insertHtml = function() {
	data.Data = loadTheJob()
	data.Html = loadTheHtml()
	var h = cheerio.load(data.Html)
	var body = h('body')
	for (var i = 0; i < data.Data.length; i++) {
		var tem = htmlTemplate(data.Data[i], i)
		body.append(tem)
	}
	// log('测试获取html', `<!DOCTYPE html>${h('html').html()}`)
	return `<!DOCTYPE html>${h('html').html()}`
}

var saveHTML = function() {
	var allHtml = insertHtml()
	log('***********allHtml', allHtml)
	var fs = require('fs')
	var path = '可视化html/Web前端职位.html'
	fs.writeFileSync(path, allHtml)
}

var __main = function() {
	saveHTML()
}

__main()
