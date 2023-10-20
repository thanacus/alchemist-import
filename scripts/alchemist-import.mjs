import { presentDialog } from './import-application.mjs'

CONFIG.debug.hooks = true

Hooks.once('ready', function() {   
    Hooks.on('renderSceneDirectory', (html, entryOptions) => {
        const button = document.createElement("button")
        button.innerHTML = "<i class='fas fa-flask'></i>Import DA"
        button.addEventListener("click", presentDialog)

        $("#sidebar>.scenes-sidebar>.directory-header>.action-buttons").append(button)
    })
})
