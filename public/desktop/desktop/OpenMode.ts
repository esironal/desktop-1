

var mapper = {};
var typeMap = {};
var taskbar = null;

export module Module { 
    export function remove(name) { 
        delete mapper[name];
    }

    export function setDesktop(desktop) { 
        taskbar = desktop.taskBar;

    }
    
    export function excute(code, cmp) { 
        if(!mapper[code]) return;
        var app = mapper[code].call(null, cmp);

        if (app) 
            taskbar.addTaskIcon(app);
    }

    export function getAppNames(openType) { 
        return typeMap[openType];
    }

    export function getAppsByType(fileType) { 
        return typeMap[fileType];
    }

    export function addApplication(apps) 
    { 
        if (apps instanceof Array) 
        { 
            for (var i = 0, l = apps.length; i < l; i++) 
            { 
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
}
