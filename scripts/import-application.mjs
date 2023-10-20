const IMPORT_LOCATION = "maps/"
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
        "token-attacher": {},
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
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
                <label style="width: 200px">DA Image:</label>
                <input id="alchemist-import-image-file-import" type="file" accept=".jpg,.png"/>
                <label style="width: 200px">DA JSON:</label>
                <input id="alchemist-import-json-file-import" type="file" accept=".json"/>
            </div>
        `
        
        const callback = async (html) => {
            this.handleDaImport(html)
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
            const fileReader = new FileReader()
            fileReader.onload = event => resolve(JSON.parse(event.target.result))
            fileReader.onerror = error => reject(error)
            fileReader.readAsText(file)
        })
    }
      
    async handleDaImport(html) {
        const image = html.find('input#alchemist-import-image-file-import').prop('files')[0];
        const json = html.find('#alchemist-import-json-file-import').prop('files')[0];
        const object = await this.parseJsonFile(json)
        
        $.extend(true, object, DEFAULT_SETTINGS)

        object.name = object.name.replaceAll("-", " ").toProperCase()
        let scene = game.scenes.get(this.sceneId)

        object.background = object.background || {}
        object.background.src = IMPORT_LOCATION + image.name

        await FilePicker.upload("data", IMPORT_LOCATION, image)
        await scene.update(object)
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