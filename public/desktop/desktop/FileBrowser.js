var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../panel/Panel", "../core/src/Util", "./Table", "./Shortcut"], function(require, exports, __pan__, __util__, __tab__, __sho__) {
    var pan = __pan__;
    var util = __util__;
    var tab = __tab__;
    var sho = __sho__;
    
    

    var FileBrowser = (function (_super) {
        __extends(FileBrowser, _super);
        function FileBrowser() {
            _super.apply(this, arguments);
            this.role = "file-browser";
            this.title = "Root";
            this.icon = 'file-browser';
            this.dialog = true;
            this.backs = [];
            this.aheads = [];
            this.table = null;
            this.folder_id = '';
            this.overflow_y = "auto";
            this.path = "";
            this.pathMap = {};
            this.selectMap = {};
            this.events = {
                "mousedown": "setFocus",
                "click .icon-win8-min": "hide",
                "click .icon-win8-close": "destroy",
                "click .icon-win8-max": "max",
                "click .fb-icon-back": "back",
                "click .fb-icon-ahead": "ahead",
                "click .fb-icon-back-active": "back",
                "click .fb-icon-ahead-active": "ahead",
                "keyup .fb-path-input": "keyupPathInput",
                "dragenter .win-panel-body": "dragenter",
                "dragleave .win-panel-body": "dragleave",
                "dragover .win-panel-body": "dragover",
                "drop .win-panel-body": "drop",
                'click button': 'clickBtn'
            };
            this.template = [
                '<div class="win-panel ${me.className}" id="${me.id}" filebrowser="${me.file_id}" style ="${me.style}">',
                '<div class="header">',
                '<span class="title">${me.title}</span>',
                '<div class="panel-title-buttons">',
                '<div class="icon icon-win8-close"> </div>',
                '<div class="icon icon-win8-max"> </div>',
                '<div class="icon icon-win8-min"> </div>',
                '</div>',
                '</div>',
                '<div class="fb-tool" style="">',
                '<div class="icon fb-icon-go fb-icon-back"></div>',
                '<div class="icon fb-icon-go fb-icon-ahead"></div>',
                '<div class="icon fb-icon-triangle"></div>',
                '<div class="icon fb-icon-arrow"></div>',
                '<div class="fb-src-input">',
                '<div class="fb-icon-computer"></div>',
                '<input type="text" class="fb-path-input" value="" />',
                '</div>',
                '<div class="fb-icon-refresh" style="">',
                '<div class="refresh"></div>',
                '</div>',
                '<div class="fb-search-input" >',
                '<input type="text"style="" class="search-input" />',
                '<div class="fb-search"></div>',
                '</div>',
                '</div>',
                '<div id="${me.id}-body" webkitdirectory="" class="win-panel-body" style="top:71px;overflow-y:auto">',
                '</div>',
                '</div>'
            ];
        }
        FileBrowser.prototype.dragenter = function () {
            this.setBodyStyle("background", "#fff4e8");
        };

        FileBrowser.prototype.dragleave = function () {
            this.setBodyStyle("background", "#fff");
        };

        FileBrowser.prototype.dragover = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };

        FileBrowser.prototype.drop = function (e) {
            var self = this;
            e.stopPropagation();
            e.preventDefault();
            this.setBodyStyle("background", "#fff");

            var trigger = e.originalEvent.dataTransfer.getData("moveCmp");
            if (trigger) {
                var target = util.getCmp(e.target.id) || util.getCmp($(e.target).parents('.desktop-table-container')[0].id);
                trigger = util.getCmp(trigger);

                if (trigger.parent_id === self.folder_id) {
                    return;
                }

                $.ajax({
                    type: 'POST',
                    data: { trigger_id: trigger._id, target_id: self.folder_id },
                    url: 'changeFilePath',
                    success: function () {
                        self.setDrop(trigger, target, self.folder_id);

                        return;
                        $('div [fileId=' + trigger._id + ']').each(function () {
                            $(this).remove();
                        });
                        $('.win-panel').each(function () {
                            if ($(this).attr('filebrowser') !== self.folder_id) {
                                return;
                            }

                            var config = trigger.config;
                            config.targetCmp = target.targetCmp;
                            config.path = target.targetCmp.path + '/' + trigger.name;
                            config.parent_id = self.folder_id;
                            config.id = undefined;

                            var cmp = new sho.Shortcut(config);
                            util.getCmp(this.id).getItem(0).add(cmp);
                            util.getCmp(this.id).getItem(0).initItems(cmp);
                            console.log(config);
                        });
                    }
                });
                return;
            }

            var files = e.originalEvent.dataTransfer.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onprogress = function (e) {
                    console.log(e.loaded / e.total);
                };
                reader.readAsDataURL(file);
                this.uploadFile(file);
            }
        };
        FileBrowser.prototype.uploadFile = function (file) {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open('POST', "upload", true);

            xhr.onload = function () {
                // result.innerHTML += this.responseText;
                //handleComplete(file.size);
            };

            xhr.onerror = function () {
            };

            xhr.upload.onprogress = function (event) {
                console.log("onprogress");
            };

            xhr.upload.onloadstart = function (event) {
                console.log("onloadstart");
            };

            // prepare FormData
            var formData = new FormData();
            console.log(1);
            formData.append('myfile', file);
            formData.append('parent_id', this.folder_id);

            console.log(2);

            //xhr.send(formData);
            $.ajax({
                url: "upload",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                onprogress: function () {
                    console.log(1111);
                },
                progress: function () {
                    console.log(2222);
                },
                success: function (res) {
                    console.log("onload");
                    self.updateItemByPath();
                }
            });
        };

        FileBrowser.prototype.keyupPathInput = function (event) {
            if (event.keyCode === 13) {
                if (this.pathMap[this.getPath()]) {
                    this.setPath(this.getPath());
                    this.updateItemByPath();
                } else {
                    $(".searchInput").focus();
                    alert("无法找到该路径");
                }
            }
        };

        FileBrowser.prototype.ahead = function () {
            if (this.aheads.length) {
                this.backs.push({ path: this.path, folder_id: this.folder_id });
                var prev = this.aheads.pop();
                this.folder_id = prev.folder_id;
                this.setPath(prev.path);
                this.updateItemByPath();
            }
        };

        FileBrowser.prototype.back = function () {
            if (this.backs.length) {
                this.aheads.push({ path: this.path, folder_id: this.folder_id });
                var prev = this.backs.pop();
                this.folder_id = prev.folder_id;
                this.setPath(prev.path);
                this.updateItemByPath();
            }
        };

        FileBrowser.prototype.updateItemByPath = function () {
            console.log(this.aheads.length, this.backs.length);

            if (this.aheads.length) {
                this.find('.fb-icon-ahead').addClass('fb-icon-ahead-active');
                this.find('.fb-icon-ahead').removeClass('fb-icon-ahead');
            } else {
                this.find('.fb-icon-ahead-active').addClass('fb-icon-ahead');
                this.find('.fb-icon-ahead-active').removeClass('fb-icon-ahead-active');
            }
            if (this.backs.length) {
                this.find('.fb-icon-back').addClass('fb-icon-back-active');
                this.find('.fb-icon-back').removeClass('fb-icon-back');
            } else {
                this.find('.fb-icon-back-active').addClass('fb-icon-back');
                this.find('.fb-icon-back-active').removeClass('fb-icon-back-active');
            }
            this.getItemsByPath(this.path);
        };

        FileBrowser.prototype.initialize = function () {
            var that = this;
            this.table = new tab.Table({
                targetCmp: that,
                items: []
            });

            this.add(this.table);
            this.getItemsByPath("");
            this.path = "";
            _super.prototype.initialize.call(this);
        };

        FileBrowser.prototype.setPath = function (path) {
            $(this.element).find(".fb-path-input").val(path);
            this.path = path;
        };

        FileBrowser.prototype.getPath = function () {
            return $(this.element).find(".fb-path-input").val();
        };

        FileBrowser.prototype.getFilesByPath = function (path) {
        };

        FileBrowser.prototype.getItemsByPath = function (path) {
            var self = this;

            $.ajax({
                type: 'POST',
                data: { parent_id: self.folder_id || '' },
                url: 'getFilesByPath',
                success: function (records) {
                    var children = [];

                    for (var i = 0, len = records.length; i < len; i++) {
                        var rec = records[i];
                        rec._id = records[i]._id;
                        rec.parent_id = records[i].parent_id;
                        rec.textColor = "#000";
                        rec.targetCmp = self;

                        rec.path = self.path ? (self.path + "/" + rec.name) : rec.name;

                        rec.click = function () {
                            var sho = this;
                            if (window['keyDownMap'] && window['keyDownMap']['17']) {
                                if (self.selectMap[this.id]) {
                                    setTimeout(function () {
                                        self.selectMap[sho.id].removeClass('active');
                                        delete self.selectMap[sho.id];
                                    }, 1);
                                } else {
                                    self.selectMap[this.id] = this;
                                }
                            } else {
                                self.selectMap = {};
                                self.selectMap[this.id] = this;
                            }

                            setTimeout(function () {
                                for (var key in self.selectMap) {
                                    self.selectMap[key].addClass('active');
                                }
                            }, 1);
                        };

                        rec.onDrop = function (trigger, target) {
                            if (trigger.parent_id === target._id) {
                                alert(trigger.parent_id + '   ' + target._id);
                                return;
                            }

                            $.ajax({
                                type: 'POST',
                                data: { trigger_id: trigger._id, target_id: target._id },
                                url: 'changeFilePath',
                                success: function () {
                                    self.setDrop(trigger, target, target._id);
                                }
                            });
                        };
                        children.push(new sho.Shortcut(rec));
                    }

                    self.getItem(0).bindItems(children);

                    $(self.element).attr('filebrowser', self.folder_id);
                }
            });
        };
        FileBrowser.prototype.setDrop = function (trigger, target, folder_id) {
            $('div [fileId=' + trigger._id + ']').each(function () {
                $(this).remove();
            });

            $('.win-panel').each(function () {
                if ($(this).attr('filebrowser') !== folder_id) {
                    return;
                }
                var config = trigger.config;
                config.targetCmp = util.getCmp(this.id);
                config.path = target.targetCmp.path + '/' + trigger.name;
                config.parent_id = folder_id;
                config.id = undefined;

                var cmp = new sho.Shortcut(config);
                util.getCmp(this.id).getItem(0).add(cmp);
                util.getCmp(this.id).getItem(0).initItems(cmp);
                console.log(config);
            });
        };
        return FileBrowser;
    })(pan.Panel);
    exports.FileBrowser = FileBrowser;
});
