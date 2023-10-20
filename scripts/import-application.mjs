const IMPORT_LOCATION = "maps/"
const AUTO_CENTER_MAP = true
const DEFAULT_SETTINGS = {
    "backgroundColor": "#000000",
    "grid": {
        "type": 1,
        "size": 150,
        "color": "#000000",
        "alpha": 0.2,
        "distance": 5,
        "units": "ft"
    },
    "initial": {
        "x": 5550,
        "y": 4050,
        "scale": 0.45
    },
    "tokenVision": false,
    "fogExploration": false,
    "flags": {
        "LockView": {
            "editViewbox": false,
            "lockPan": false,
            "lockPanInit": false,
            "lockZoom": false,
            "lockZoomInit": false,
            "boundingBox": false,
            "boundingBoxInit": false,
            "autoScale": "0",
            "rotation": "0",
            "sidebar": "noChange",
            "blackenSidebar": false,
            "excludeSidebar": false,
            "hideUI": false,
            "forceInit": true
        }
    }
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
};

class AlchemistImportDialog extends Dialog {
    constructor(dialogOptions, renderOptions) {
        const IMPORT_TEMPLATE = `
            <style>
                .alchemist-import-dialog {
                    display: grid;
                    grid-template-columns: 1fr 3fr;
                }
            </style>
            <div class="alchemist-import-dialog">
                <label style="width: 200px">Select DA Image and JSON:</label>
                <input id="alchemist-import-files" type="file" accept=".jpg,.json" multiple/>
            </div>
        `
        
        const callback = async (html) => {
            const result = this.handleDaImport(html)
            if(!result) {
                console.error("Unable to import DA objects...")
            }
        }

        dialogOptions = {
            ...dialogOptions,
            title: "Dungeon Alchemist Import",
            content: IMPORT_TEMPLATE,
            buttons: {
                import: {
                    icon: '<i class="fas fa-flask"></i>',
                    label: "Import",
                    callback: callback
                }
            }
        }
        super(dialogOptions, renderOptions)
        
        this.sceneId = dialogOptions.sceneId
    }

    async parseJsonFile(file) {
        return new Promise((resolve, reject) => {
            try {
                const fileReader = new FileReader()
                fileReader.onload = event => resolve(JSON.parse(event.target.result))
                fileReader.onerror = error => reject(error)
                fileReader.readAsText(file)
            } catch(error) {
                ui.notifications.error(`Error opening DA JSON: ${error}`)
                reject(error)
            }
        })
    }
      
    async handleDaImport(html) {
        const files = html.find('input#alchemist-import-files').prop('files')
        let image = undefined
        let json = undefined

        // File checks
        if(files.length != 2) {
            ui.notifications.error(`Expected only two files (one .jpg, one .json), got ${files.length}`)
            return
        }

        // Obtain the files
        if(files[0].name?.endsWith("jpg")) {
            image = files[0]
            json = files[1]
        } else {
            image = files[1]
            json = files[0]
        }

        // Load both data objects
        const object = await this.parseJsonFile(json)
        await FilePicker.upload("data", IMPORT_LOCATION, image)
        
        // Merge and update scene information
        $.extend(true, object, DEFAULT_SETTINGS)
        object.name = object.name.replaceAll("-", " ").toProperCase()
        object.background = object.background || {}
        object.background.src = IMPORT_LOCATION + image.name

        if(AUTO_CENTER_MAP) {
            object.initial = object.initial || {}
            object.initial.x = Math.round(object.width / 2)
            object.initial.y = Math.round(object.height / 2)
        }

        const scene = Scene.create(object)

        scene.createThumbnail().then(t => {
            scene.update({thumb: t.thumb})
        })
    }
}

export function presentDialog(sceneId) {
    const dialog = new AlchemistImportDialog({
        sceneId: sceneId
    })
    dialog.render(true)
}