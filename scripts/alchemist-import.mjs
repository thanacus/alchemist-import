import { presentDialog } from './import-application.mjs'

Hooks.once('ready', function() {   
    Hooks.on('getSceneDirectoryEntryContext', (html, entryOptions) => {
        entryOptions.push({
            name: "Import Dungeon Alchemist Scene",
            callback: (li) => {
                presentDialog(li[0].dataset.documentId)
            },
            icon: '<i class="fas fa-flask"></i>',
            condition: () => {
                return game.user.isGM
            }
        });
    });
})
