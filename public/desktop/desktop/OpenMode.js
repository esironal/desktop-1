define(["require", "exports"], function(require, exports) {
    var mapper = {};
    var typeMap = {};
    var taskbar = null;

    (function (Module) {
        function remove(name) {
            delete mapper[name];
        }
        Module.remove = remove;

        function setDesktop(desktop) {
            taskbar = desktop.taskBar;
        }
        Module.setDesktop = setDesktop;

        function excute(code, cmp) {
            if (!mapper[code])
                return;
            var app = mapper[code].call(null, cmp);

            if (app)
                taskbar.addTaskIcon(app);
        }
        Module.excute = excute;

        function getAppNames(openType) {
            return typeMap[openType];
        }
        Module.getAppNames = getAppNames;

        function getAppsByType(fileType) {
            return typeMap[fileType];
        }
        Module.getAppsByType = getAppsByType;

        function addApplication(apps) {
            if (apps instanceof Array) {
                for (var i = 0, l = apps.length; i < l; i++) {
                    var app = apps[i];
                    mapper[app.code] = app.handler;

                    if (typeof app.openType === 'string') {
                        app.openType = [app.openType];
                    }

                    for (var j = 0, len = app.openType.length; j < len; j++) {
                        typeMap[app.openType[j]] = typeMap[app.openType[j]] || [];
                        typeMap[app.openType[j]].push(app);
                    }
                }
            }
        }
        Module.addApplication = addApplication;
    })(exports.Module || (exports.Module = {}));
    var Module = exports.Module;
});
