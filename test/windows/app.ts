
import desk = require("../../public/desktop/desktop/Desktop")
import sho = require("../../public/desktop/desktop/Shortcut")
import tas = require("../../public/desktop/desktop/TaskBar")
import fb = require("../../public/desktop/desktop/FileBrowser")
import util = require("../../public/desktop/core/src/Util")
import panel = require("../../public/desktop/panel/Panel")
import tab = require("../../public/desktop/tab/Panel")
import play = require("../../public/desktop/application/Player")

$(document).ready(function(){

    var folderList = [{
        fileType: "folder",
        text: "视频",
        children: [
        {
            fileType: "txt",
            text: "Gee-少女时代.mp4",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "video"
        }
        ]
    }
    ,{
        fileType: "folder",
        text: "Rack2",
        children: [
        {
            fileType: "txt",
            text: "server1",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }
        ,{
            fileType: "txt",
            text: "server2",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }
        ,{
            fileType: "txt",
            text: "server3",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }
        ,{
            fileType: "txt",
            text: "server4",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }]
    }
    ,{
        fileType: "folder",
        text: "Rack3",
        children: [
        {
            fileType: "txt",
            text: "server1",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }
        ,{
            fileType: "txt",
            text: "server2",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }
        ,{
            fileType: "txt",
            text: "server3",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }
        ,{
            fileType: "txt",
            text: "server4",
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }]
    }]

    util.OpenMode.setOpenMode({
        "file-browser": function () {
            var panel = new fb.FileBrowser({
                shortcuts: folderList,
                taskBar: desktop.taskBar,
                style: "width:1100px; height:600px;",
            });
            panel.render("body");
            return panel;
        },
        "video": (cfg) =>{ 
            var player = new play.Player({
                width: 576*1.3,
                height: 432*1.3+30,
                border: false,
                title: cfg.text,
                dialog: true,
            });
            player.render("body");
            return player;
        }
    });

    var desktop = new desk.Desktop({
    
        shortcuts: [
        {
            text: "我的电脑",
            iconCls: "icon-computers",
            taskImageCls: "task-file",
            openMode: "file-browser"
        }]
    });
    
    var fileBrowser = new fb.FileBrowser({
        shortcuts: folderList,
        taskBar: desktop.taskBar
    });


    var pp2 = new panel.Panel({
        html: "<h1>111</h1>",
        width: "100%",
        style: "float:left",
        height: "50%",
        title: "Hello"
    });
    var pp3 = new panel.Panel({
        html: "<h1>222</h1>",
        width: "100%",
        style: "float:left",
        height: "50%",
        title: "World"
    });
    
    var p2 = new panel.Panel({
        width: "50%",
        height: "100%",
        bodyPadding:0,
        html: "<h1>Hello</h1>",
    });
    var p3 = new panel.Panel({
        html: "<h1>World</h1>",
        width: "50%",
        //border: 0,
        bodyPadding:0,
        height: "100%",
        title: "World"
    });

    var p = new panel.Panel({
        width: 576*1.3,
        height: 432*1.3+30,
        border: false,
        title: "我的电脑",
        dialog: true,
        html:'<video  width="100%" height="100%" src="../../resource/video/Gee.mp4" controls="controls"></video>'
       // items: [p2, p3]
    });

    //p.render("body");
    desktop.render("body");
    //fileBrowser.render("body");
});