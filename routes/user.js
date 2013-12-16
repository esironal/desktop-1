
var User = require('../models/User.js');
var File = require('../models/File.js');
var Movie = require('../models/movie.js');
var fs = require("fs");

//File.remove({}, function () { })
File.find({}, function (err, rec) {
    console.log(rec)
})
exports.login = function (req, res)
{
    User.find(req.body, function(err, records){
        if (err) throw new Error();
        var record = records[0];
       
        
        if (records.length) {
            req.session.user = records[0];
            req.session.user_id = records[0]._id;
            res.redirect('/');
        }
        else
            res.render('login', { error: 'Account or password error' });
    });
};

exports.register = function (req, res)
{
    User.create(req.body, function (err, record)
    {
        if (err)
            res.render('register');

        File.create({ user_id: record._id, parent_id: '', name: 'image', type: 'folder' }, function (err, rec) {
            File.create({ user_id: record._id, parent_id: rec._id, filePath: 'http://img.aiyidu.com/forum/201012/08/110906gverr18l1h88rz39.jpg', name: '1.jpg', type: 'image/jpeg' }, function () {

            });
            File.create({ user_id: record._id, parent_id: rec._id, filePath: 'http://pic3.bbzhi.com/mingxingbizhi/shaonvshidai/star_starjp_288683_9.jpg', name: '2.jpg', type: 'image/jpeg' }, function () {

            });
        });

        File.create({ user_id: record._id, parent_id: '', name: 'mv', type: 'folder' }, function (err, rec) {
            File.create({ user_id: record._id, parent_id: rec._id, filePath: 'http://player.youku.com/player.php/sid/XMjMxODU3Mzg0/v.swf', name: 'RunDevil', type: 'flashPlayer' }, function () {

            });
        });

        res.redirect('/');
    });
}

exports.createFile = function (req, res)
{
    req.body.user_id = req.session.user_id;

    File.create(req.body, function (err, record)
    {
        if (err) throw new Error();
        res.json({ record: record });
    });
}

exports.deleteFile = function (req, res)
{
    File.findByIdAndRemove(req.body.id, function (err, record) {
        if (err) throw new Error();
        res.json({ title: 'webOS' });
    });
}

var subtype = {
    drama: '电视剧'
    , movie: '电影'
    , anime: '动漫'
    , variety: '综艺'
}

exports.mount = function (req, res)
{
    var movie_id = req.body.id;
    
    Find.find({ movie_id: movie_id }, function () {

    });

    Movie.findById(movie_id, function (err, movie)
    {
        var folderName = subtype[movie.subtype];

        File.findOne({ parent_id: '', name: folderName }, function (err, rec)
        {
            if (!rec)
            {
                File.create({ user_id: req.session.user_id, parent_id: '', name: folderName, type: 'folder', safe: true }, function (err, rec)
                {
                    File.create({ user_id: req.session.user_id, parent_id: rec._id, movie_id: movie_id, name: movie.title, type: 'movie_folder', poster: movie.poster }, function (err, data) {
                        res.json(JSON.stringify(data));
                    });
                });
                return;
            }
            File.create({ user_id: req.session.user_id, parent_id: rec._id, movie_id: movie_id, name: movie.title, type: 'movie_folder', poster: movie.poster }, function (err, data) {
                res.json(JSON.stringify(data))
            });
        });
    });
}

exports.updateFileName = function (req, res)
{
     File.findByIdAndUpdate(req.body.id,{name: req.body.name}, function (err, record){
        if (err) throw new Error();
        res.json({ title: 'webOS' });
    });
}

exports.getFilesByPath = function (req, res)
{
    req.body.user_id = req.session.user_id;
    var online = req.body.online;
    delete req.body.title;

    console.log(req.body);

    if (req.body.type === 'movie_folder' || req.body.type === 'online_folder')
    {
        Movie.findById(req.body._id, function (err, movie)
        {
            if (!movie) {
                return res.json([]);
            }

            var onlineFolders = [];
            
            if (req.body.online_name)
            {
                var online = movie.online[req.body.online_name];
                console.log(req.body.online_name);
                online.forEach(function (rec)
                {
                    var map = {};
                    map.type = 'flashPlayer';
                    console.log(req.body.online_name, /百度影音/.test(req.body.online_name))
                    if (/百度影音/.test(req.body.online_name)) {
                        map.type = 'baiduPlayer';
                    }
                    map.name = rec.title;
                    map.filePath = rec.src;
                    
                    map.movie_id = movie._id;
                    map.safe = true;
                    onlineFolders.push(map);

                });

                res.json(onlineFolders);

                return;
            }

            for(var key in movie.online)
            {
                if (movie.online[key].length) {
                    var map = {};
                    map.type = 'online_folder';
                    map.name = key;
                    map.movie_id = movie._id;
                    map.safe = true;
                    onlineFolders.push(map);
                }
            }

            res.json(onlineFolders);
        });

        return;
    }

    File.find({ user_id: req.session.user_id, parent_id: req.body._id }, function (err, record)
    {
        if (err) throw new Error();



        res.json(record);
    });
}

exports.changeFilePath = function (req, res)
{
    File.findByIdAndUpdate(req.body.trigger_id, { parent_id: req.body.target_id }, function (err, record) {
        if (err) throw new Error();
        res.json({  });
    });
}

exports.upload = function (req, res)
{
    uploadFile(req.files.myfile, __dirname + '/../public/uploads', function (filePath)
    {
        var query = {
            parent_id: req.body.parent_id
            , name: req.files.myfile.name
            , user_id: req.session.user_id
            , type: req.files.myfile.type
            , filePath: 'uploads/' + req.files.myfile.name
        }

        File.create(query, function (err, record)
        {
            if (err) throw new Error();
            res.json({ title: 'webOS' });
        });

        res.json({ 'success': 'true' });
    });
}

function uploadFile(file, newPath, fn)
{
    var name = file.name;
    var tmp_path = file.path;
    var target_path = newPath + '/' + name;
    fs.rename(tmp_path, target_path, function (err)
    {
        if (err)
            throw err;
        fn(target_path);
    });
}