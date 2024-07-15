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
                <label style="width: 200px">Select DA Image/Vid and JSON:</label>
                <input id="alchemist-import-files" type="file" accept=".jpg,.json,.mp4,.webm" multiple/>
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
        try {
            const importLocation = game.settings.get('alchemist-import', 'import-location')
            const defaultConfigString = game.settings.get('alchemist-import', 'default-config')
            let defaultConfig = undefined

            if(defaultConfigString) {
                try {
                    defaultConfig = JSON.parse(defaultConfigString)
                } catch(error) {
                    throw(`Unable to read Import Additions/Overrides. Please provide valid JSON!: ${error}`)
                }
            }
            
            const files = html.find('input#alchemist-import-files').prop('files')
            let map = undefined
            let json = undefined

            // File checks
            if(files.length != 2) {
                ui.notifications.error(`Expected only two files (one image/vid file, one .json), got ${files.length}`)
                return
            }

            // Obtain the files
            if(files[1].name?.endsWith("json")) {
                map = files[0]
                json = files[1]
            } else {
                map = files[1]
                json = files[0]
            }

            // Load both data objects
            const object = await this.parseJsonFile(json)
            await FilePicker.upload("data", importLocation, map)

            // Temp fix until DA exports properly for V12
            if(game.release.generation === 12) {
                console.log("As of this plugin's writing, DA direct exports need updating!");
                object.walls.forEach((w) => {
                    if(w.move === 1) {
                        w.move = 20;
                    }
                    if(w.sense === 1) {
                        w.light = 20;
                        w.sight = 20;
                    }
                    if(w.sound === 1) {
                        w.sound = 20;
                    }
                });
            }
            
            // Merge and update scene information
            $.extend(true, object, defaultConfig)
            object.name = object.name.replaceAll("-", " ").toProperCase()
            object.background = object.background || {}
            object.background.src = `${importLocation}/${map.name}`

            Scene.create(object)
        } catch(error) {
            ui.notifications.error(`Error while importing Dungeon Alchemist map: ${error}`)
        }
    }
}

export function presentDialog(sceneId) {
    const dialog = new AlchemistImportDialog({
        sceneId: sceneId
    })
    dialog.render(true)
}