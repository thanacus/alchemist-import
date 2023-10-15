Hooks.on('updateScene', async (scene,data) => {
    console.log("New scene:")
    console.log(scene)
    if(!hasProperty(data, 'flags.alchemist-import.imported')) {
        console.log("No flag, setting!")
        await scene.setFlag('alchemist-import', 'imported', true )
        await scene.update({ backgroundColor: "#abcabc" })
        console.log("Flag set!")
    }
})