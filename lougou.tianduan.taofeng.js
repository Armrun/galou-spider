/*
 * @authors RunQuan Li
 * @date    2018-12-19 10:13:55
 *
 */

// 包导入
"use strict"
const request = require('request')
const cheerio = require('cheerio')
const syncRequest = require('sync-request')


// 保存职位信息的类
// 职位名称 公司简介 职位要求 职位描述
function Job() {
    this.jobName = ''
    this.company = ''
    this.jobRequest = ''
    this.jobDescription = ''
    this.url = ''
}

// 下标1 ~ 4 的随机生成函数
const random4 = function() {
	var x = Math.random()
	if (x <= 0.25) { return 1 }
	else if (x > 0.25 && x <= 0.5) { return 2 }
	else if (x > 0.5 && x <= 0.75) { return 3 }
	else if (x > 0.75 && x <= 1)   { return 4 }
}

// 伪装信息
var uaList = ["Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1","Mozilla/5.0 (X11; CrOS i686 2268.111.0) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11","Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6","Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1090.0 Safari/536.6",]
var coList = ["user_trace_token=20181029135401-88973c08-6428-46a4-9569-675fb25d110c; __guid=237742470.892997790755905200.1540792441572.6167; _ga=GA1.2.1551850098.1540792442; LGUID=20181029135402-09c6bb68-db3f-11e8-83f1-5254005c3644; _gid=GA1.2.1601737927.1545184171; index_location_city=%E5%B9%BF%E5%B7%9E; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22%24device_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; LGSID=20181219211055-84a289ca-038f-11e9-ab38-525400f775ce; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fqianduankaifaqita%2F; PRE_LAND=https%3A%2F%2Fpassport.lagou.com%2Flogin%2Flogin.html%3Fmsg%3Dvalidation%26uStatus%3D2%26clientIp%3D120.230.105.162; JSESSIONID=ABAAABAABEEAAJA371B1174F8A391AC2CBE0DDFD0012C31; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1544576558,1545057813,1545184171,1545225091; X_HTTP_TOKEN=cd281d179b96b9ad3afc614cf13340d5; _putrc=9729FBBA05B57621123F89F2B170EADC; login=true; unick=%E6%8B%89%E5%8B%BE%E7%94%A8%E6%88%B77896; hasDeliver=0; gate_login_token=04f5747c7d898fca72eb50afef15f7270a979268d9fa65b76c30c93f49637b5e; SEARCH_ID=01c2d1f1fecc405b9bcfab9f4abf13b7; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1545226007; LGRID=20181219212645-bb474eec-0391-11e9-94bc-5254005c3644; monitor_count=124", "user_trace_token=20181029135401-88973c08-6428-46a4-9569-675fb25d110c; __guid=237742470.892997790755905200.1540792441572.6167; _ga=GA1.2.1551850098.1540792442; LGUID=20181029135402-09c6bb68-db3f-11e8-83f1-5254005c3644; _gid=GA1.2.1601737927.1545184171; index_location_city=%E5%B9%BF%E5%B7%9E; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22%24device_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; LGSID=20181219211055-84a289ca-038f-11e9-ab38-525400f775ce; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fqianduankaifaqita%2F; PRE_LAND=https%3A%2F%2Fpassport.lagou.com%2Flogin%2Flogin.html%3Fmsg%3Dvalidation%26uStatus%3D2%26clientIp%3D120.230.105.162; JSESSIONID=ABAAABAABEEAAJA371B1174F8A391AC2CBE0DDFD0012C31; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1544576558,1545057813,1545184171,1545225091; X_HTTP_TOKEN=cd281d179b96b9ad3afc614cf13340d5; SEARCH_ID=af7b2168091b462fbdb007fb137837b1; _putrc=9729FBBA05B57621123F89F2B170EADC; login=true; unick=%E6%8B%89%E5%8B%BE%E7%94%A8%E6%88%B77896; _gat=1; hasDeliver=0; gate_login_token=04f5747c7d898fca72eb50afef15f7270a979268d9fa65b76c30c93f49637b5e; monitor_count=120; LGRID=20181219211836-97a31ba3-0390-11e9-ab38-525400f775ce; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1545225517", "user_trace_token=20181029135401-88973c08-6428-46a4-9569-675fb25d110c; __guid=237742470.892997790755905200.1540792441572.6167; _ga=GA1.2.1551850098.1540792442; LGUID=20181029135402-09c6bb68-db3f-11e8-83f1-5254005c3644; _gid=GA1.2.1601737927.1545184171; index_location_city=%E5%B9%BF%E5%B7%9E; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22%24device_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; LGSID=20181219211055-84a289ca-038f-11e9-ab38-525400f775ce; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fqianduankaifaqita%2F; PRE_LAND=https%3A%2F%2Fpassport.lagou.com%2Flogin%2Flogin.html%3Fmsg%3Dvalidation%26uStatus%3D2%26clientIp%3D120.230.105.162; JSESSIONID=ABAAABAABEEAAJA371B1174F8A391AC2CBE0DDFD0012C31; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1544576558,1545057813,1545184171,1545225091; X_HTTP_TOKEN=cd281d179b96b9ad3afc614cf13340d5; SEARCH_ID=af7b2168091b462fbdb007fb137837b1; _putrc=9729FBBA05B57621123F89F2B170EADC; login=true; unick=%E6%8B%89%E5%8B%BE%E7%94%A8%E6%88%B77896; _gat=1; hasDeliver=0; gate_login_token=04f5747c7d898fca72eb50afef15f7270a979268d9fa65b76c30c93f49637b5e; monitor_count=112; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1545225396; LGRID=20181219211634-4f166bcd-0390-11e9-94bc-5254005c3644", "user_trace_token=20181029135401-88973c08-6428-46a4-9569-675fb25d110c; __guid=237742470.892997790755905200.1540792441572.6167; _ga=GA1.2.1551850098.1540792442; LGUID=20181029135402-09c6bb68-db3f-11e8-83f1-5254005c3644; _gid=GA1.2.1601737927.1545184171; index_location_city=%E5%B9%BF%E5%B7%9E; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22%24device_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; LGSID=20181219211055-84a289ca-038f-11e9-ab38-525400f775ce; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fqianduankaifaqita%2F; PRE_LAND=https%3A%2F%2Fpassport.lagou.com%2Flogin%2Flogin.html%3Fmsg%3Dvalidation%26uStatus%3D2%26clientIp%3D120.230.105.162; JSESSIONID=ABAAABAABEEAAJA371B1174F8A391AC2CBE0DDFD0012C31; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1544576558,1545057813,1545184171,1545225091; X_HTTP_TOKEN=cd281d179b96b9ad3afc614cf13340d5; SEARCH_ID=af7b2168091b462fbdb007fb137837b1; _putrc=9729FBBA05B57621123F89F2B170EADC; login=true; unick=%E6%8B%89%E5%8B%BE%E7%94%A8%E6%88%B77896; _gat=1; hasDeliver=0; gate_login_token=04f5747c7d898fca72eb50afef15f7270a979268d9fa65b76c30c93f49637b5e; LGRID=20181219211831-947a89e4-0390-11e9-ab38-525400f775ce; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1545225512; monitor_count=120"]
const cookie = 'user_trace_token=20181029135401-88973c08-6428-46a4-9569-675fb25d110c; __guid=237742470.892997790755905200.1540792441572.6167; _ga=GA1.2.1551850098.1540792442; LGUID=20181029135402-09c6bb68-db3f-11e8-83f1-5254005c3644; _gid=GA1.2.1601737927.1545184171; index_location_city=%E5%B9%BF%E5%B7%9E; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22%24device_id%22%3A%22167c42996c2387-05cb88ab83274b-3c604504-2073600-167c42996c368a%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; LGSID=20181219211055-84a289ca-038f-11e9-ab38-525400f775ce; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fqianduankaifaqita%2F; PRE_LAND=https%3A%2F%2Fpassport.lagou.com%2Flogin%2Flogin.html%3Fmsg%3Dvalidation%26uStatus%3D2%26clientIp%3D120.230.105.162; JSESSIONID=ABAAABAABEEAAJA371B1174F8A391AC2CBE0DDFD0012C31; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1544576558,1545057813,1545184171,1545225091; X_HTTP_TOKEN=cd281d179b96b9ad3afc614cf13340d5; _putrc=9729FBBA05B57621123F89F2B170EADC; login=true; unick=%E6%8B%89%E5%8B%BE%E7%94%A8%E6%88%B77896; hasDeliver=0; gate_login_token=04f5747c7d898fca72eb50afef15f7270a979268d9fa65b76c30c93f49637b5e; _gat=1; LGRID=20181219212633-b4102648-0391-11e9-94bc-5254005c3644; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1545225994; SEARCH_ID=01c2d1f1fecc405b9bcfab9f4abf13b7; monitor_count=123'
	// const cookie = 'JSESSIONID=ABAAABAAAFCAAEG5F1B109C05D6E5B506B7C4845904B5AE; user_trace_token=20181219202125-24b74a82a5e148b4a68c0b95c431e44e; _ga=GA1.2.1773023947.1545222087; _gat=1; LGSID=20181219202126-9aed468f-0388-11e9-94bb-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Fzhaopin%2Fqianduankaifaqita%2F; LGRID=20181219202126-9aed483a-0388-11e9-94bb-5254005c3644; LGUID=20181219202126-9aed4898-0388-11e9-94bb-5254005c3644; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1545222087; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1545222087; _gid=GA1.2.333588405.1545222087; SEARCH_ID=f96c5ecd26ae4017ba12f574bd4e8936'	
	// const useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
	// const headers = {
 //        'Cookie': cookie,
 //        'User-Agent': useragent,
 //    }

// console.log 打包
const log = function() {
    console.log.apply(console, arguments)
}

const allTheJob = []

// 处理获取 html 中的 '\n' 字段
const stringRemove = function(str) {
	// 注意'\n'的 length 是1
	var re = ''
	for (var i = 0; i < str.length; i++) {
		if(str.slice(i, i + 1) == '\n') {
			// 跳过 '\n' 区域
			continue
		}                             
		re += str[i]
	}
	return re
}

const dataFromA = function(href) {
    // 这个函数来从一个详情页 href链接 里面读取职位信息
    var onejob = new Job()
    var headers = {
        'Cookie': cookie,
        'User-Agent': uaList[random4()],
    }
    var options = {
        headers: headers,
    }
	log('--- 详情页打开\n')
	// 确定爬虫访问成功
	while(true) {
    	var html = syncRequest('get', href, options).getBody().toString()
	    var h = cheerio.load(html)
	    // 抓取值非空 否则重新请求
    	if (h('.job_company').html() != null && h('.job_request p:first-child').html() != null && h('.job_bt').html() != null) {
    		break
    	}
    }

    // 修复图片链接, 加上 http 协议
    var imgUrl = h('.job_company').find('img').attr('src')
    h('.job_company').find('img').attr('src', `http:${imgUrl}`)
    // var imgUrlChange = h('.job_company').find('img').attr('src')
    // log('图片链接', imgUrlChange)

	onejob.jobName = h('.job-name').attr('title')
	onejob.company = stringRemove(h('.job_company').html())
	onejob.jobRequest = stringRemove(h('.job_request p:first-child').html())
	onejob.jobDescription = stringRemove(h('.job_bt').html())
	onejob.url = href
    log('***新增职位数据抓取成功!***', onejob.jobName, `\nurl:${href}\n`)
    return onejob
}

const saveJob = function(Data) {
	log('保存函数执行\n')
    // 这个函数用来把一个保存了所有电影对象的数组保存到文件中
    const fs = require('fs')
    const path = 'JavaScript.txt'
    const s = JSON.stringify(Data, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            log('*** 写入文件错误', error)
        } else {
            log('--- 保存成功')
        }
    })
}

var openUrl = function(jobs) {
	log('--- 详情页URL正在逐一打开...\n')
	for (var i = 0; i < jobs.length; i++) {
		var data = dataFromA(jobs[i])
		// log('##################返回的数据', data)
		allTheJob.push(data)
	}
}

const jobFromUrl = function(options, url) {
    // request 从一个 url 下载数据并调用回调函数
    var jobs = []
    var html = syncRequest('get', url, options).getBody().toString()
    log('*** 爬取详情链接函数运作正常\n')
    // log('****xindongxi****', html)
    // cheerio.load 用字符串作为参数返回一个可以查询的特殊对象
    const e = cheerio.load(html)
    // 选择含有详情页链接的 a 标签元素
    const jobAs = e('.position_link')
    for(let i = 0; i < jobAs.length; i++) {
    	// log(`执行 ${i} 次`)
        let element = jobAs[i]
        var href = e(element).attr('href')
        jobs.push(href)
    }        
    // 保存 jobs 数组到文件中
    // log('获取的详情页链接数组', jobs)
	openUrl(jobs)
}

const autoPageTurning = function(url, pageMax) {
	var headers = {
        'Cookie': cookie,
        'User-Agent': uaList[random4()],
    }
    var options = {
        headers: headers,
    }
	var URL = url
	jobFromUrl(options, url)
	for (var i = 2; i <= pageMax; i++) {
		URL = `${url}${i}/?filterOption=3`
		log('--- 跳转至下一页....\n', URL, `总页数:${pageMax},当前第${i}页`)
		jobFromUrl(options, URL)
	}
}

const __main = function() {
    // request 从一个 url 下载数据并调用回调函数
    // 根据 伪装登录爬虫设置图例 替换 cookie 和 useragent 中的内容
    // 这里 useragent 与 cookie已经替换好
    const url = 'https://www.lagou.com/zhaopin/JavaScript/'
    // const options = {
    //     url: url,
    //     headers: headers,
    // }
	
	autoPageTurning(url, 4)
    saveJob(allTheJob)
    
}

// 程序开始的主函数
__main()

