var http = require('http');
var BufferHelper = require('bufferhelper')
var iconv = require('iconv-lite');
var querystring = require('querystring')
var cheerio = require('cheerio');

var uuid = require('node-uuid');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dburl = 'mongodb://127.0.0.1/webOS';
mongoose.connect(dburl);

var Movie = require('./models/movie.js');

console.log(/百度影音/.test('百度影音'))

/*
Movie.remove({}, function (e, m) {

});


Movie.remove({}, function (e, m) {

});
//return

Movie.remove({}, function (e, m) {

});
*/
Movie.findOne({}, function (e, m) {
    //console.log(m)
});



function downloadFile(download_path, file_url, fileName, callback) {

    if (!file_url) {
        return callback();
    }

    var uid = uuid.v1()
    var date = new Date();

    var index = file_url.lastIndexOf('.');

    var index2 = fileName.lastIndexOf('?')
    var index3 = fileName.lastIndexOf('.')
    var name = fileName.substring(index2 + 1, index3) + file_url.substring(index, file_url.length);

    var file = fs.createWriteStream(download_path + name);

    var req = http.get(file_url, function (res) {
        res.on('data', function (data) {
            file.write(data);
        }).on('end', function () {
            file.end();
            callback(name)
            //console.log('download success');
        });
    });

    req.on('error', function (e) {
        try {
            file.end();
            fs.unlink(download_path + "\\" + file_name)
            console.log('problem with request: ' + download_path + "\\" + file_name);
        } catch (e) {

        }

    });
}
function getHTML(url, callback) {
    var req = http.get(url, function (res) {
        // var bufferHelper = new BufferHelper();
        res.setEncoding('utf8');
        var html = "";
        res.on('data', function (chunk) {
            //bufferHelper.concat(chunk);
            html += chunk;
        });

        res.on('end', function (chunk) {
            //var html= iconv.decode(bufferHelper.toBuffer(),'GBK');
            //console.log(html)
            callback(html);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message, url);
        //callback(null);
        getHTML(url, callback);
    });

    req.end();
}

var subtype = {
    '动作片': 'movie',
    '喜剧片': 'movie',
    '爱情片': 'movie',
    '科幻片': 'movie',
    '恐怖片': 'movie',
    '剧情片': 'movie',
    '战争片': 'movie',
    '纪录片': 'movie',
    '动画片': 'movie',
    '微电影': 'movie',
    '大陆剧': 'drama',
    '港剧': 'drama',
    '台剧': 'drama',
    '日剧': 'drama',
    '韩剧': 'drama',
    '美剧': 'drama',
    '泰剧': 'drama',
    '英剧': 'drama',
    '印度剧': 'drama',
    '新加坡剧': 'drama',
    '海外剧': 'drama',
    '内地综艺': 'variety',
    '台湾综艺': 'variety',
    '香港综艺': 'variety',
    '韩国综艺': 'variety',
    '日本综艺': 'variety',
    '欧美综艺': 'variety',
    '演唱会': 'variety',
    '晚会': 'variety',
    '其他娱乐': 'variety',
    '日本动漫': 'anime',
    '国产动漫': 'anime',
    '欧美动漫': 'anime',
};
function getInfo(url, callback, isUpdate) {
    getHTML(url, function (html) {
        if (!html)
            return callback();
        var $ = cheerio.load(html);
        var rows = $($($('body table')[1]).find('tr'));
        var cell = $(rows[0]).find('td');
        var match = null;
        var poster = $(cell[0]).find('img').attr('src');

        var infos = $(cell[1]).find('table tr');

        var map = {}
            , bdMap = {}
            , youkuList = []
            , swfList = []
            , leshList = []
            , tudouList = []
            , tengxunList = []
            , souhuList = []
            , qiyiList = []
            , woleList = []
        ;

        //        console.log(url)
        map.search_url = url;

        match = /<!--影片名称开始代码-->.*<!--影片名称结束代码-->/.exec(html)

        if (match)
            map.title = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        match = /<!--影片别名开始代码-->.*<!--影片别名结束代码-->/.exec(html);

        if (match)
            map.original_title = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        match = /<!--影片导演开始代码-->.*<!--影片导演结束代码-->/.exec(html)

        if (match)
            map.directors = match[0].replace(/<[^x00-xff]+>/g, '').split(' ') || '';

        match = /<!--影片主演开始代码-->.*<!--影片主演结束代码-->/.exec(html)

        if (match)
            map.casts = match[0].replace(/<[^x00-xff]+>/g, '').split(' ') || '';


        match = /<!--影片备注开始代码-->.*<!--影片备注结束代码-->/.exec(html)

        if (match)
            map.movie_remark = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        match = /<!--影片状态开始代码-->.*<!--影片状态结束代码-->/.exec(html)

        if (match)
            map.movie_status = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        match = /<!--影片分类开始代码-->.*<!--影片分类结束代码-->/.exec(html)

        if (match)
            map.subtype = subtype[match[0].replace(/<[^x00-xff]+>/g, '')] || '';

        match = /<!--影片分类开始代码-->.*<!--影片分类结束代码-->/.exec(html)

        if (match)
            map.genres = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        match = /<!--影片标签开始代码-->.*<!--影片标签结束代码-->/.exec(html)

        if (match)
            map.tags = match[0].replace(/<[^x00-xff]+>/g, '').split(' ') || '';

        match = /<!--影片地区开始代码-->.*<!--影片地区结束代码-->/.exec(html)

        if (match)
            map.countries = match[0].replace(/<[^x00-xff]+>/g, '').split(' ')[0] || '';

        match = /<!--影片语言开始代码-->.*<!--影片语言结束代码-->/.exec(html)

        if (match)
            map.language = match[0].replace(/<[^x00-xff]+>/g, '').split(' ')[0] || '';

        match = /<!--上映日期开始代码-->.*<!--上映日期结束代码-->/.exec(html)

        if (match)
            map.pubdates = new Date((match[0].replace(/<[^x00-xff]+>/g, '') + '-01-01 01:01:01').replace('(', '')) || '';

        match = /<!--平均分开始代码-->.*<!--平均分结束代码-->/.exec(html)

        if (match)
            map.rating = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        match = /<!--豆瓣ID开始\d+豆瓣ID结束-->/.exec(html)

        if (match)
            map.douban_id = /\d+/.exec(match[0])[0] || '';

        match = /<!--影片介绍开始代码-->.*<!--影片介绍结束代码-->/.exec(html)

        if (match)
            map.summary = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        match = /<!--影片更新时间开始代码-->.*<!--影片更新时间结束代码-->/.exec(html)

        if (match)
            map.last_update = match[0].replace(/<[^x00-xff]+>/g, '') || '';

        var online_html = html.match(/<!--百度播放列表开始代码-->[\S\s]*?<!--百度播放列表结束代码-->/g)

        if (online_html) {
            online_html.forEach(function (online_html, index) {
                //online_html = online_html[0];
                var names = ["百度影音"]
                var mathch = ( online_html.match(/<!--地址开始-->.*<!--地址结束-->/g) || [])
                mathch.forEach(function (str, i) {
                    
                    var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');

                    if (!names[index] && /[^第(\d|.|\-)集]+/.exec(arr[0]))
                        names[index] = names[0] + /[^第(\d|.|\-)集]+/.exec(arr[0])[0];
                    if (!names[index]) {
                        namess[index] = names[0]+index
                    }

                    bdMap[names[index]] = bdMap[names[index]] || [];

                    bdMap[names[index]].push({ index: i, src: arr[1], title: arr[0] });

                });
            });
        }

        online_html = /<!--swf播放列表开始代码-->[\s\S]*?<!--swf播放列表结束代码-->/.exec(html)
        if (online_html) {
            online_html = online_html[0];
            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                swfList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        online_html = /<!--优酷播放列表开始代码-->[\s\S]*?<!--优酷播放列表结束代码-->/.exec(html)

        if (online_html) {
            online_html = online_html[0];

            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                youkuList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        online_html = /<!--乐视播放列表开始代码-->[\s\S]*?<!--乐视播放列表结束代码-->/.exec(html)

        if (online_html) {
            online_html = online_html[0];

            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                leshList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        online_html = /<!--土豆播放列表开始代码-->[\s\S]*?<!--土豆播放列表结束代码-->/.exec(html)

        if (online_html) {
            online_html = online_html[0];

            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                tudouList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        online_html = /<!--腾讯播放列表开始代码-->[\s\S]*?<!--腾讯播放列表结束代码-->/.exec(html)

        if (online_html) {
            online_html = online_html[0];

            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                tengxunList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        online_html = /<!--搜狐播放列表开始代码-->[\s\S]*?<!--搜狐播放列表结束代码-->/.exec(html)

        if (online_html) {
            online_html = online_html[0];

            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                souhuList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        online_html = /<!--奇艺播放列表开始代码-->[\s\S]*?<!--奇艺播放列表结束代码-->/.exec(html)

        if (online_html) {
            online_html = online_html[0];

            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                qiyiList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        online_html = /<!--我乐播放列表开始代码-->[\s\S]*?<!--我乐播放列表结束代码-->/.exec(html)

        if (online_html) {
            online_html = online_html[0];

            online_html.match(/<!--地址开始-->.*<!--地址结束-->/g).forEach(function (str, i) {
                var arr = str.replace(/<[^x00-xff]+>/g, '').split('$');
                woleList.push({ index: i, src: arr[1], title: arr[0] })
            });
        }

        map.online = {
            '优酷视频': youkuList
            , '其它视频': swfList
            , '我乐视频': woleList
            , '奇艺视频': qiyiList
            , '搜狐视频': souhuList
            , '腾讯视频': tengxunList
            , '乐视视频': leshList
            , '土豆视频': tudouList
        }


        for (var key in bdMap) {
            map.online[key] = bdMap[key]
        }
        //console.log(map)
        if (!isUpdate) {
            downloadFile('./public/poster/', poster, url, function (name) {
                map.poster = name;
                callback(map);
            });
        }
        else {
            callback(map);
        }
    });
}
var pageCount = 0, isAll = true, dyCount=0;
function addByPage(i, callback)
{
    console.log(i)
    getHTML('http://www.kkzy.cc/vodlist/?1-' + (i) + '.html', function (html)
    {
        var $ = cheerio.load(html);
        var arr = []
        $('table .row').each(function (i) {
            var last_update = undefined;
            if ($($(this).find('td')[3]).find('font')[0]) {
                last_update = $($(this).find('td')[3]).find('font').html();
            }
            else {
                last_update = $($(this).find('td')[3]).html();
            }
            arr.push({
                url: 'http://www.kkzy.cc' + $($(this).find('td')[0]).find('a').attr('href')
                , last_update: last_update
            });
        });

        var count = arr.length;
        console.log(count)
        arr.forEach(function (rec)
        {
            Movie.findOne({ search_url: rec.url, last_update: rec.last_update }, function (err, m)
            {
                if (m && !isAll) {
                    //               console.log(count)
                    if (--count === 0) {
                        console.log('page end' + ++pageCount)
                        callback();
                    }
                    return;
                }

                Movie.findOne({ search_url: rec.url }, function (err, m)
                {
                    getInfo(rec.url, function (info)
                    {
                        if (!info)
                        {
                            --count;
                            return;
                        }

                        if (m) {
                            console.log(m.title, 'update', ++dyCount);
                            
                            Movie.findByIdAndUpdate(m._id, info, function (err) {
                                if (err) console.log(err);
                            });

                            if (--count === 0) {
                                console.log('page end' + ++pageCount)
                                callback();
                            }
                            return;
                        }
                        Movie.create(info, function (err, data) {
                            if (err) {
                                console.log(info)
                                console.log(err);
                            }

                            if (--count === 0) {
                                console.log('page end' + ++pageCount)
                                callback();
                            }
                            console.log(data.title, ++dyCount);
                        });
                    });
                });
            })
        });

        //console.log(arr);
    });
}

var start = 1
    , end = 10
    ;

function run(i, count)
{
    if (i > 10)
        return;

    addByPage(i, function () {
        run(++i, count);
    });
}

run(start, end);

































/*

function getAllLink(searchword, callback)
{

    var buffer = new Buffer(searchword);
    var json = JSON.stringify(buffer);
    buffer = iconv.encode(buffer, 'gbk')
    searchword = ""

    buffer.toJSON().forEach(function (num) {
        searchword += "%" + num.toString(16)
    });
    searchword = 'searchword=' + searchword.toUpperCase();

    var options = {
        host: 'www.13198.net',
        port: 80,
        path: '/search.asp',
        method: 'POST',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': searchword.length
        }
    };
    var req = http.request(options, function (res) {
        var html = "";
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });

        res.on('end', function (chunk) {
            var html = iconv.decode(bufferHelper.toBuffer(), 'GBK');

            var $ = cheerio.load(html);
            var arr = []
             $('.le a').each(function(){
                 arr.push($(this).attr('href'));
            })
            console.log(arr)
            callback(html)
        });
    })

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(searchword + '\n');
    req.end();
}

console.log(String.fromCharCode('45'))

getAllLink('继承者们', function (html) {
    //console.log(html);
});

function getHTML(url, callback) {
    console.log(url, 'fffff')
    var req = http.get(url, function (res) {
        //var bufferHelper = new BufferHelper();
        res.setEncoding('utf8');
        var html = "";
        res.on('data', function (chunk) {
            //bufferHelper.concat(chunk);
            html += chunk;
        });

        res.on('end', function (chunk) {
            //var html= iconv.decode(bufferHelper.toBuffer(),'GBK');
            console.log(html)
            callback(html);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        exports.getHTML(url, callback)
        //req.end();
    });

    req.end();
}

var req = http.get(url, function (res) {
    //var bufferHelper = new BufferHelper();
    res.setEncoding('utf8');
    var html = "";
    res.on('data', function (chunk) {
        //bufferHelper.concat(chunk);
        html += chunk;
    });

    res.on('end', function (chunk) {
        //var html= iconv.decode(bufferHelper.toBuffer(),'GBK');
        console.log(html)
        callback(html);
    });
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
    exports.getHTML(url, callback)
    //req.end();
});

req.end();
*/
