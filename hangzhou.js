const downloadTile = require('./util')

function download(level, x, y) {
    downloadTile(level, {
        rect: [{ lng: 119.33624, lat: 30.79611 }, { lng: 121.67633, lat: 29.63435 }],
        dir: 'hangzhou',
        startX: x,
        startY: y
    }, (x, y, level) => {
        download(level, x, y)
    })
}

for(let i = 0; i < 8; i++) {
    download(i)
}