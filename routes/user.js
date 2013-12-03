
var User = require('../models/User.js');
var File = require('../models/File.js');
var fs = require("fs");

exports.login = function (req, res)
{


    User.find(req.body, function(err, records){
        if (err) throw new Error();
        var record = records[0];
       
        
        console.log(records);
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
    console.log(req.body)
    User.create(req.body, function (err, record)
    {
        if (err) throw new Error();

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
        res.json({ title: 'webOS' });
    });
}

exports.deleteFile = function (req, res)
{
    File.findByIdAndRemove(req.body.id, function (err, record)
    {
        if (err) throw new Error();
        res.json({ title: 'webOS' });
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

    File.find(req.body, function (err, record)
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
    console.log(req.files.myfile);
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