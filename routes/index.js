
/*
 * GET home page.
 */
var http = require('http');
var fs = require('fs');
var url = require('url');

exports.register = function (req, res)
{
    res.render('register', { title: 'webOS' });
}

exports.login = function (req, res)
{
    res.render('login', { title: 'Express' });
};

exports.index = function (req, res)
{
    if (req.session.user)
        res.render('index', { title: 'Express' });
    else
        res.render('login', { title: 'Express' });
};

exports.render = function (req, res)
{
    res.render(req.query.url);
}

exports.getHtml = function (req2, res2)
{
    var req = http.get(req2.query.url, function (res) {
        //var bufferHelper = new BufferHelper();
        res.setEncoding('utf8');
        var html = "";
        res.on('data', function (chunk) {
            //bufferHelper.concat(chunk);
            html += chunk;
        });

        res.on('end', function (chunk) {
            //var html= iconv.decode(bufferHelper.toBuffer(),'GBK');

            var url2 = url.parse(req2.query.url);

            html = html.replace(/href="\//g, 'href="http://' + url2.hostname + '/');
            html = html.replace(/src="\//g, 'src="http://' + url2.hostname + '/');

            fs.writeFileSync(__dirname + '/../views/__111.ejs', html);

            res2.send('__111');
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        exports.getHTML(url, callback)
        //req.end();
    });

    req.end();
};
