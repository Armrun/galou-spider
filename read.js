
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
		<hr />
	`
	return tem
}

// var insertHtml = function(test, id) {
// 	// data.Html = loadTheHtml()
// 	// var h = cheerio.load(data.Html)
// 	// var body = h('body')

// 	var tem = htmlTemplate(test, id)
// 	return tem
// 	// log(data.Html)


// }

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
	var path = 'JavaScript职位.html'
	fs.writeFileSync(path, allHtml)
}

saveHTML()

// insertHtml()