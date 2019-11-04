
const fs = require('fs')
const request = require('request');

function lnglatToTile(longitude, latitude, level) {
    let tileX = lngToTileX(longitude, level);
    let tileY = latToTileY(latitude, level)
    return {
        tileX,
        tileY
    };
}

function getMapSize(level) {
    return Math.pow(2, level);
}

function lngToTileX(longitude, level) {
    let x = (longitude + 180) / 360;
    let tileX = Math.floor(x * getMapSize(level));
    return tileX;
}

function latToTileY(latitude, level) {
    let lat_rad = latitude * Math.PI / 180;
    let y = (1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2;
    let tileY = Math.floor(y * getMapSize(level));

    // 代替性算法,使用了一些三角变化，其实完全等价
    //let sinLatitude = Math.sin(latitude * Math.PI / 180);
    //let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
    //let tileY = Math.floor(y * getMapSize(level));

    return tileY;
}

function getTileByRect(level, rect) {
    const topLeftTile = lnglatToTile(rect[0].lng, rect[0].lat, level)
    const bottomRightTile = lnglatToTile(rect[1].lng, rect[1].lat, level)
    console.log(topLeftTile, bottomRightTile)
    return {
        topLeftTile, bottomRightTile
    }
}

function getTileGlobe(level) {
    const size = getMapSize(level)
    console.log(size)
    return {
        topLeftTile: {
            tileX: 0,
            tileY: 0,
        },
        bottomRightTile: {
            tileX: size - 1,
            tileY: size - 1,
        },
    }
}

function downloadImage(uri, dirname, filename) {
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true })
    }
    const stream = fs.createWriteStream(filename)
    return new Promise((resolve, reject) => {
        request.get(uri, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
            }
        }).on('response', function (response) {
            console.log(uri)
            resolve()
        }).on('error', function (err) {
            console.log(err)
            reject(err)
        }).pipe(stream);
        // stream.on('end', () => {
        //     resolve()
        // })
    })

};

async function downloadTile(level, options, callback) {
    const { rect, startX, startY, dir = 'globe' } = options
    const tiles = rect ? getTileByRect(level, rect) : getTileGlobe(level)
    const topLeftTile = tiles.topLeftTile
    const bottomRightTile = tiles.bottomRightTile
    let curX, curY, curLevel
    try {
        for (let x = startX ? startX : topLeftTile.tileX; x <= bottomRightTile.tileX; x++) {
            let tileY = x === startX && startY !== undefined ? startY : topLeftTile.tileY
            for (let y = tileY; y <= bottomRightTile.tileY; y++) {
                curX = x
                curY = y
                curLevel = level
                const uri = `http://mt0.google.cn/vt/lyrs=s&z=${level}&x=${x}&y=${y}`
                await downloadImage(uri, `${dir}/${level}/${x}`, `${dir}/${level}/${x}/${y}.jpg`)
            }
        }
    }
    catch (error) {
        if (callback) {
            callback(curX, curY, curLevel)
        }
    }

}

module.exports = downloadTile