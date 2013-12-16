import pan = require("../panel/Panel")
import util = require("../core/src/Util")
import tab = require("./Table")
import sho = require("./Shortcut")
import tas = require("./TaskBar")
import om = require("./OpenMode")

export class FileBrowser extends pan.Panel
{
    taskBar: tas.TaskBar;
    role = "file-browser";
    title = "Root";
    icon = 'file-browser';
    fileType ;
    dialog= true;
    backs= [];
    aheads = [];
    table = null;
    folder_id = '';
    overflow_y="auto";
    path= "";
    pathMap = {};
    selectMap = {};
    events= 
    {
        "mousedown" : "setFocus"
        , "click .icon-win8-min" : "hide"
        , "click .icon-win8-close" : "destroy"
        , "click .icon-win8-max": "max"
        , "click .fb-icon-back": "back"
        , "click .fb-icon-ahead": "ahead"
        , "click .fb-icon-back-active": "back"
        , "click .fb-icon-ahead-active": "ahead"
        , "click .win-panel-body": "clickBodyPanel"
        , 'click button': 'clickBtn'
        , 'mousedown .title': 'mousedownTitle'
    };

    clickBodyPanel(event)
    {
        if (!$(event.target).hasClass('shortcut-icon') && !$(event.target).parents('.shortcut-icon').length)
            this.find('.desktop-icon').removeClass("active");
    }

    addShortcuts(items)
    {
        var shorts = [];

        for (var i = 0, len = items.length; i < len; i++)
        {
            var shortcut = new sho.Shortcut(items[i]);

            shortcut['style'] = {
                "display": "inline-block"
                , "vertical-align": "top"
            }

            shorts.push(shortcut);
        }

        this.bindItems(shorts);
    }

    activeAheadIcon(isActive)
    {
        if (isActive) {
            this.find('.fb-icon-ahead').addClass('fb-icon-ahead-active')
            this.find('.fb-icon-ahead').removeClass('fb-icon-ahead');
        }
        else {
            this.find('.fb-icon-ahead-active').addClass('fb-icon-ahead');
            this.find('.fb-icon-ahead-active').removeClass('fb-icon-ahead-active');
        }
    }

    activeBackIcon(isActive)
    {
        if (isActive) {
            this.find('.fb-icon-back').addClass('fb-icon-back-active');
            this.find('.fb-icon-back').removeClass('fb-icon-back');
        }
        else {
            this.find('.fb-icon-back-active').addClass('fb-icon-back');
            this.find('.fb-icon-back-active').removeClass('fb-icon-back-active');
        }
    }

    ahead() 
    { 
        
    }

    back() 
    { 
        
    }

    setPath(path) {
        $(this.element).find(".fb-path-input").val(path);
        this.path = path;
    }

    setTitle(name){ 
        this.find('.title').html(name);
        this.title = name;
    }

    getPath(){ 
        return this.path;
    }


    template = 
    [
        '<div class="win-panel ${me.className}" id="${me.id}" filebrowser="${me.file_id}" style ="${me.style}">'
            , '<div class="header">'
                , '<span class="title">${me.title}</span>'
                , '<div class="panel-title-buttons">'
                   ,  '<div class="icon icon-win8-close"> </div>'
                   ,  '<div class="icon icon-win8-max"> </div>'
                   ,  '<div class="icon icon-win8-min"> </div>'
                , '</div>'
            , '</div>'
            , '<div class="fb-tool" style="">'
                , '<div class="icon fb-icon-go fb-icon-back"></div>'
                , '<div class="icon fb-icon-go fb-icon-ahead"></div>'
                , '<div class="icon fb-icon-triangle"></div>'
                , '<div class="icon fb-icon-arrow"></div>'
                , '<div class="fb-src-input">'
                    , '<div class="fb-icon-computer"></div>'
        , '<input type="text" class="fb-path-input" readonly="readonly" value="" />'
                , '</div>'
                , '<div class="fb-icon-refresh" style="">'
                    , '<div class="refresh"></div>'
                , '</div>'
               // , '<div class="fb-search-input" >'
               ////     , '<input type="text"style="" class="search-input" />'
               //     , '<div class="fb-search"></div>'
               // , '</div>'
            , '</div>'
            , '<div  class="win-panel-body" style="top:71px;overflow-y:auto">'
                , '<div id="${me.id}" class="desktop-table-container" style="height:100%">'
                    , '<table class="desktop-table">'
                        , '<tbody id="${me.id}-body">'
                        , '</tbody>'
                    , '</table>'
                , '</div>'
            , '</div>'
        , '</div>'
    ];
}
