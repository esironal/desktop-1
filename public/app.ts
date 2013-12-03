
import desk = require("desktop/desktop/Desktop")
import sho = require("desktop/desktop/Shortcut")
import tas = require("desktop/desktop/TaskBar")
import fb = require("desktop/desktop/FileBrowser")
import openMode = require("desktop/desktop/OpenMode")
import panel = require("desktop/panel/Panel")
import tab = require("desktop/tab/Panel")
import play = require("desktop/application/Player")
import Picasa = require("desktop/application/Picasa")

$(document).ready(function(){
    

    var desktop = new desk.Desktop({
        shortcuts: [
        {
            text: "我的电脑",
            icon: "file-browser",
            type: "file-browser"
        }
        , {
            text: "百度",
            icon: "baidu",
            type: "baidu"
        }]
    });
    
    desktop.render("body");

    openMode.Module.setDesktop(desktop);
    
    openMode.Module.addApplication([{
        code: 'baidu',
        name: '百度一下',
        icon: 'bplayer',
        openType: 'baidu',
        icon: '',
        handler: function (cfg) { 

            var pn = new panel.Panel({
                html: '',
                width: $("body").width() / 1.5,
                height: $("body").height() / 1.5,
                dialog: true,
                icon: 'baidu',
                title: "百度一下"
            });
            pn.render();

            $.ajax({
                url: "/getHtml?url=http://www.51rrkan.com/omdsj/cdxxg/",
                type: "get",
                error: function () {
                    // alert("Http status: "+xhr.status+" "+xhr,statusText+"\najaxOptions:"+ajaxOptions+"\nthrownError:"+thrownError+"\n"+xhr.responseText );
                    // alert("请设置：Internet选项-安全-自定义级别-其它-跨域访问数据源设置为“启用”状态");
                },
                 success: function (msg) {
                     //alert($(msg));
                     pn.setHtml('<iframe style="width:100%;height:100%" src="/render?url='+msg+'">  </iframe>')
                     //$(pn.bodyElement).find('iframe').html("<!DOCTYPE html>"+msg);
                }
            });
            return pn;
        }
    },{
        code: 'picasa',
        name: '图片浏览器',
        icon: 'picasa',
        openType: 'image/jpeg',
        icon: '',
        handler: function (cfg) { 
            var pic = new Picasa.Picasa({
                code: 'picasa',
                border: false,
                filePath: cfg.filePath,
                title: cfg.name,
                dialog: true,
            });
            pic.render("body");
            return pic;
        }
    },{
        code: 'player',
        name: '射手影音',
        icon: 'bplayer',
        openType: ['video/mp4', 'baiduPlayer', 'flashPlayer'],
        icon: '',
        handler: function (cfg)
        { 
            var player = new play.Player({
                code: 'player',
                border: false,
                type: cfg.type,
                filePath: cfg.filePath,
                title: cfg.name,
                dialog: true,
            });
            player.render("body");
            return player;
        }
    },
    {
        code: 'bfPlayer',
        name: '暴风影音',
        icon: '',
        openType: 'video/mp4',
        handler: function (cfg) { 
            alert("没有安装暴风影音");
        }
    },
    {
        code: 'file-browser',
        name: '文件浏览器',
        icon: 'file-browser',
        openType: 'file-browser',
        handler: function () 
        { 
            var panel = new fb.FileBrowser({
                code: 'file-browser',
                taskBar: desktop.taskBar,
                style: "width:"+($('body').width()/2)+"px; height:"+($('body').height()/1.5)+"px;",
            });
            panel.render("body");
            return panel;
        }
    },{
        openType: 'folder',
        code: 'folder',
        name: '打开文件',
        handler: function (cmp)
        { 
            cmp.targetCmp.backs.push({path: cmp.targetCmp.path, folder_id: cmp.targetCmp.folder_id});
            cmp.targetCmp.folder_id = cmp._id;
            cmp.targetCmp.setPath(cmp.path);
            cmp.targetCmp.updateItemByPath();
            cmp.targetCmp.aheads = [];
            cmp.targetCmp.setTitle(cmp.name);
        }
    }]);
});

    /*

    var folderList = [{
        fileType: "folder",
        openMode: "folder",
        text: "视频",
        children: [
        {
            fileType: "mp4",
            text: "Gee-少女时代.mp4",
            frameWidth: 576,
            frameHeight: 432,
            iconCls: "icon-visual",
            taskImageCls: "task-mvs",
            openMode: "player"
        }
        ]
    }
    ,{
        fileType: "folder",
        openMode: "folder",
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
        openMode: "folder",
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
        html:'<video  width="100%" height="100%" src="video/Gee.mp4" controls="controls"></video>'
       // items: [p2, p3]
    });
    //p.render("body");
    //fileBrowser.render("body");
    */