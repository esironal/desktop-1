
import desk = require("../../public/desktop/desktop/Desktop")
import sho = require("../../public/desktop/desktop/Shortcut")
import tab = require("../../public/desktop/desktop/Table")
import tas = require("../../public/desktop/desktop/TaskBar")
import pan = require("../../public/desktop/desktop/FileBrowser")
import util = require("../../public/desktop/core/src/Util")

declare var Design;

Design.require(['Design.panel.Panel', 'Design.form.Form', 'Design.form.field.Combobox', 'Design.tab.Panel', 'Design.tree.Tree', 'Design.chart.Chart','Design.Container'])
	
Design.onReady(function(){



    var folderList = [{
        fileType: "folder",
        text: "Design组件演示",
        children: [{
            fileType: "folder",
            text: "表格演示",
            children: [{
                fileType: "txt",
                text: "普通表格",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "base-grid"
            },{
                fileType: "txt",
                text: "可编辑表格",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "edit-grid"
            },{
                fileType: "txt",
                text: "表格分页",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "page-grid"
            },{
                fileType: "txt",
                text: "表头分组",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "group-header-grid"
            },{
                fileType: "txt",
                text: "树形表格",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "tree-grid"
            }]
        }, {
            fileType: "folder",
            text: "表单演示",
            children: [{
                fileType: "txt",
                text: "表单3",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "contact-form"
            },{
                fileType: "txt",
                text: "表单2",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "field-container"
            },{
                fileType: "txt",
                text: "表单1",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "base-form"
            }]
        }, {
            fileType: "folder",
            text: "选项卡",
            children: [{
                fileType: "txt",
                text: "选项卡",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "tab-panel"
            }]
        }, {
            fileType: "folder",
            text: "组合应用",
            children: [{
                fileType: "txt",
                text: "利率模拟",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "rate-simulating"
            },{
                fileType: "txt",
                text: "报表",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "report-panel"
            },{
                fileType: "txt",
                text: "期限结构",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "term-structor"
            }]
        }, {
            fileType: "folder",
            text: "树",
            children: [{
                fileType: "txt",
                text: "树",
                iconCls: "icon-visual",
                taskImageCls: "task-mvs",
                openMode: "super-tree"
            }]
        }]
    },{
        fileType: "txt",
        text: "文本"
    },{
        fileType: "folder",
        text: "新建文件夹（2）"
    }]

    util.OpenMode.setOpenMode({
        "base-grid": function () {
            var grid = Design.create("Design.app.BaseGrid", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "edit-grid": function () {
            var grid = Design.create("Design.app.EditGrid", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "page-grid": function () {
            var grid = Design.create("Design.app.PageGrid", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "group-header-grid": function () {
            var grid = Design.create("Design.app.GroupHeaderGrid", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "tree-grid": function () {
            var grid = Design.create("Design.app.TreeGrid", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "contact-form": function () {
            var grid = Design.create("Design.app.ContactForm", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "field-container": function () {
            var grid = Design.create("Design.app.FieldContainer", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "base-form": function () {
            var grid = Design.create("Design.app.BaseForm", {
                drag: true,
            });
            grid.show();
            return grid;
        },
        "super-tree": function () {
            var grid = Design.create("Design.app.SuperTree", {
                drag: true,
                title: {
                    text: "树"
                }
            });
            grid.show();
            return grid;
        },
        
        "rate-simulating": function () {
            window["rateSimulating"].show()
            return window["rateSimulating"];
        },
        "report-panel": function () {
            window["report"].show();
            return window["report"];
        },
        "term-structor": function () {
            window["termStructor"].show();
            return window["termStructor"];
        },
        
    
        "tab-panel": function () {
            var tab = Design.widget('tabpanel',{
			    title: {
				    text: 'tree'
			    },
			    drag: true,
			    style: {
				    width: 600,
				    height: 500
			    },
			    items: [
                    Design.create("Design.app.BaseGrid", {
                        style: {
                            width: '100%',
                            height: '100%'
                        }
                    }),
                    Design.create("Design.app.ContactForm", {
                        style: {
                            width: '100%',
                            height: '100%'
                        }
                    })
                ]
		    });
		
		    tab.show('body');
		    return tab;
        },
        "file-browser": function () {
            var panel = new pan.FileBrowser({
                shortcuts: folderList,
                taskBar: desktop.taskBar
            });

            panel.render("body");
            return panel;
        }
    });

    var desktop = new desk.Desktop({
    
        shortcuts: [{
            text: "原始表格",
            iconCls: "icon-vs",
            taskImageCls: "task-mvs",
            openMode: "base-grid"
        }, {
            text: "可编辑表格",
            iconCls: "icon-vs",
            taskImageCls: "task-mvs",
            openMode: "edit-grid"
        }, {
            text: "表格分页",
            iconCls: "icon-vs",
            taskImageCls: "task-mvs",
            openMode: "page-grid"
        }, {
            text: "表格分组",
            iconCls: "icon-vs",
            taskImageCls: "task-mvs",
            openMode: "group-header-grid"
        }, {
            text: "树形表格",
            iconCls: "icon-vs",
            taskImageCls: "task-mvs",
            openMode: "tree-grid"
        }, {
            text: "我的电脑",
            iconCls: "icon-computers",
            taskImageCls: "task-file",
            openMode: "file-browser"
        }]
    
    });
    

    desktop.render("body");
});