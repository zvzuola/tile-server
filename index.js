const downloadTile = require('./util')



function download(level, x, y) {
    downloadTile(level, {
        startX: x,
        startY: y
    }, (x, y, level) => {
        download(level, x, y)
    })
}

download(9)