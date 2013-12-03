define(["require", "exports", "desktop/desktop/Desktop", "desktop/desktop/FileBrowser", "desktop/desktop/OpenMode", "desktop/panel/Panel", "desktop/application/Player", "desktop/application/Picasa"], function(require, exports, __desk__, __fb__, __openMode__, __panel__, __play__, __Picasa__) {
    var desk = __desk__;
    
    
    var fb = __fb__;
    var openMode = __openMode__;
    var panel = __panel__;
    
    var play = __play__;
    var Picasa = __Picasa__;

    $(document).ready(function () {
        var desktop = new desk.Desktop({
            shortcuts: [
                {
                    text: "我的电脑",
                    icon: "file-browser",
                    type: "file-browser"
                },
                {
                    text: "百度",
                    icon: "baidu",
                    type: "baidu"
                }
            ]
        });

        desktop.render("body");

        openMode.Module.setDesktop(desktop);

        openMode.Module.addApplication([
            {
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
                            pn.setHtml('<iframe style="width:100%;height:100%" src="/render?url=' + msg + '">  </iframe>');
                            //$(pn.bodyElement).find('iframe').html("<!DOCTYPE html>"+msg);
                        }
                    });
                    return pn;
                }
            },
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
                        dialog: true
                    });
                    pic.render("body");
                    return pic;
                }
            },
            {
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
                        dialog: true
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
                handler: function () {
                    var panel = new fb.FileBrowser({
                        code: 'file-browser',
                        taskBar: desktop.taskBar,
                        style: "width:" + ($('body').width() / 2) + "px; height:" + ($('body').height() / 1.5) + "px;"
                    });
                    panel.render("body");
                    return panel;
                }
            },
            {
                openType: 'folder',
                code: 'folder',
                name: '打开文件',
                handler: function (cmp) {
                    cmp.targetCmp.backs.push({ path: cmp.targetCmp.path, folder_id: cmp.targetCmp.folder_id });
                    cmp.targetCmp.folder_id = cmp._id;
                    cmp.targetCmp.setPath(cmp.path);
                    cmp.targetCmp.updateItemByPath();
                    cmp.targetCmp.aheads = [];
                    cmp.targetCmp.setTitle(cmp.name);
                }
            }
        ]);
    });
});
