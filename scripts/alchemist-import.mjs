import { presentDialog } from './import-application.mjs'

Hooks.once('ready', function() {   
    Hooks.on('activateSceneDirectory', (html, entryOptions) => {
        const button = document.createElement("button")
        button.innerHTML = "<i class='fas fa-flask'></i>Import DA"
        button.addEventListener("click", presentDialog)

        $('#sidebar>#sidebar-content>#scenes .directory-footer.action-buttons').append(button)
    })


    game.settings.register('alchemist-import', 'import-location', {
        name: "Image Import Location",
        hint: "User directory to which maps will be uploaded",
        scope: "world",
        config: true,
        type: String,
        filePicker: 'folder',
        default: "maps"
    })

    game.settings.register('alchemist-import', 'default-config', {
        name: "Import Additions/Overrides",
        hint: "JSON to be merged with the imported Dungeon Alchemist configuration. Allows customization of defaults on all imported maps",
        scope: "world",
        config: true,
        type: String,
        default: ""
    })
})
