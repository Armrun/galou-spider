
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

data.Data = loadTheJob()
data.Html = loadTheHtml()
// log(data.Data[0].jobName)
log(data.Html)


