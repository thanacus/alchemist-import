# Alchemist Import

# Description
Provides a quick button for importing a Dungeon Alchemist FoundryVTT map

# Usage
On the Scenes sidebar, click the __Import DA__ button, then select both the JPG and JSON files associated with the Dungeon Alchemist export. The image will be uploaded and the JSON file will be merged with a default configuration to provide quick access to your new scene.

# Configuration
No configuration yet, but targeting the following configuration options in future releases:
- Import Location: directory on the server within which .JPG maps will be stored (currently: maps/ in user folder)
- Boolean flag to auto-center map view to the center of the map's width and height (currently: true)
- Default scene data to merge into imported maps (current values shown below)
```
{
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
```