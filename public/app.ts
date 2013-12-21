
import desk = require("desktop/desktop/Desktop")
import sho = require("desktop/desktop/Shortcut")
import tas = require("desktop/desktop/TaskBar")
import fb = require("desktop/desktop/FileBrowser")
import openMode = require("desktop/desktop/OpenMode")
import panel = require("desktop/panel/Panel")
import tab = require("desktop/tab/Panel")
import play = require("desktop/application/Player")
import Picasa = require("desktop/application/Picasa")
import cmenu = require("desktop/menu/ContextMenu")

$(document).ready(function ()
{
    document.domain = "localhost";
    $('body').click(function (event) {
        $('.content-menu').remove();
    });
    
    function showContextMenu(event)
    {
        $('.content-menu').remove();
        var shortcut = this;


        var menu = new cmenu.ContextMenu({
            top: event.pageY,
            left: event.pageX,
            items: () => {
                var list = [];

                list.push({
                    text: "打开",
                    handler: function(event) {
                        //alert('打开');
                        //getFilesByPid(this.fileBrowsse
                        shortcut.dblclick();
                    }
                }, {
                    text: "",
                    divider: true
                }, {
                    disabled: shortcut.safe,
                    text: "删除",
                    handler: function (event) {
                        alert('删除');
                    }
                },
                {
                    disabled: shortcut.safe,
                    text: "重命名",
                    handler: function (event) {
                        alert('重命名');
                    }
                });

                return list;
            } ()
        });
        menu.render(); 
    }
    
    function getFilesByPid(panel, pid, type, shortcut_name, online_name?) {
        $.ajax({
            type: 'POST',
            data: { _id: pid, type: type, online_name: online_name },
            url: 'getFilesByPath',
            success: function (records) {
                var list = [];

                for (var i = 0; i < records.length; i++) {
                    records[i].width = 110;
                    records[i].height = 105;

                    console.log(records[i].safe)
                    var rec = {
                        text: records[i].name
                        , file_id: records[i]._id
                        , safe: records[i].safe
                        , type: records[i].type
                        , parent_id: pid
                        , filePath: records[i].filePath
                        , parent_type: type
                        , parent_text: shortcut_name
                        , fileBrowsse: panel
                    };

                    if (records[i].type === 'movie_folder') {
                        rec['icon'] = 'folder-icon';
                        rec.file_id = records[i].movie_id;
                    }

                    if (records[i].type === 'online_folder') {
                        rec['icon'] = 'folder-icon';
                        rec['online_name'] = records[i].name;
                        rec.file_id = records[i].movie_id;
                    }

                    rec['dblclick'] = function (event)
                    {
                        if (this.type === 'folder') {
                            getFilesByPid(panel, this.file_id, this.type, this.text);
                        }
                        else if (this.type === 'movie_folder') {
                            getFilesByPid(panel, this.file_id, this.type, this.text);
                        }
                        else if (this.type === 'online_folder') {
                            getFilesByPid(panel, this.file_id, this.type, this.text, this.text);
                        }
                        else {
                            var apps = openMode.Module.getAppsByType(this.type);
                            openMode.Module.excute(apps[0].code, this);

                            return;
                        }

                        panel.backs.push(this);
                        panel.aheads = [];
                    }
                    
                    rec['contextmenu'] = function (event)
                    {
                        this.setActive();
                        showContextMenu.call(this, event);
                        
                        event.stopPropagation();
                        
                        return false;
                    }
                    
                    list.push(rec)
                }

                panel.addShortcuts(list);
                panel.activeAheadIcon(panel.aheads.length);
                panel.activeBackIcon(panel.backs.length);

                if (shortcut_name) {
                    panel.setPath((panel.getPath() ? panel.getPath() + ' / ' : '') + shortcut_name);
                    panel.setTitle(shortcut_name);
                }
            }
        });
    }

    var desktop = new desk.Desktop({
        shortcuts: [
        {
            text: "我的电脑",
            icon: "file-browser-icon",
            type: "file-browser",
            dblclick: function ()
            {
         
                var panel = new fb.FileBrowser({
                    code: 'file-browser'
                    , taskBar: desktop.taskBar
                    , style: "width:" + ($('body').width() / 2) + "px; height:" + ($('body').height() / 1.5) + "px;"
                    , back: function ()
                    {
                        if (panel.backs.length)
                        {
                            var shortcut = panel.backs.pop();
                            var path = panel.getPath().split(' / ');
                            
                            path.pop();
                            panel.aheads.push(shortcut);
                            getFilesByPid(panel,shortcut.parent_id, shortcut.parent_type, undefined);

                            panel.setPath(path.join(' / '));
                            panel.setTitle(shortcut.parent_text);
                        }
                    }
                    , ahead: function ()
                    {
                        if (panel.aheads.length)
                        {
                            var shortcut = panel.aheads.pop();
                            panel.backs.push(shortcut);
                            getFilesByPid(panel,shortcut.file_id, shortcut.type, shortcut.text,shortcut.online_name);
                        };
                    }
                });

                getFilesByPid(panel, '', 'folder', '我的电脑');
                panel.render("body");
                desktop.taskBar.addTaskIcon(panel);
                
            }
        }
        , {
            text: "电影搜索",
            icon: "baidu-icon",
            type: "baidu",
            dblclick: function (cfg)
            {
                var pn = new panel.Panel({
                    html: '',
                    width: $("body").width() / 1.5,
                    height: $("body").height() / 1.5,
                    dialog: true,
                    icon: 'baidu',
                    title: "电影搜索"
                });
                pn.render();

                pn.setHtml('<iframe style="width:100%;height:100%" src="http://localhost:3000">  </iframe>');

                desktop.taskBar.addTaskIcon(pn);
             }
        }]
    });
    
    desktop.render("body");

    openMode.Module.setDesktop(desktop);

    openMode.Module.addApplication([{
        code: 'player',
        name: '射手影音',
        icon: 'bplayer',
        openType: ['video/mp4', 'baiduPlayer', 'flashPlayer'],
        icon: '',
        handler: function (cfg) {
            var player = new play.Player({
                code: 'player',
                border: false,
                type: cfg.type,
                filePath: cfg.filePath,
                title: cfg.name,
                dialog: true,
                title: cfg.text,
            });
            player.render("body");
            return player;
        }
    }]);

    window['mount'] = function (id) {
        alert(id);
        $.ajax({
            type: 'POST'
            , data: { id: id }
            , url: 'mount'
            , success: (id) => {
                alert(id);
            }
        });
    }
});

    /*
{
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
        }, 


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