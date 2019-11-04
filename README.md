### 运行环境
node环境

### 运行命令
```
// 安装依赖包
yarn

// 下载杭州数据
node hangzhou.js

// 下载全球数据
node index.js
```

### api介绍
#### 下载杭州数据
```
const downloadTile = require('./util')

function download(level, x, y) {
    // level表示下载的层级,x,y表示下载的起始点

    downloadTile(level, {
        rect: [{ lng: 119.33624, lat: 30.79611 }, { lng: 121.67633, lat: 29.63435 }], // rect表示杭州的经度范围，不传则表示下载全球范围
        dir: 'hangzhou', // 下载数据的保存目录，默认是globe
        startX: x, // startX,startY表示下载的起点，有时候会出现网络等问题而下载失败，此时传入这两个参数，可以从当前点继续下载
        startY: y
    }, (x, y, level) => {
        // 下载失败的回调函数,x,y,level表示失败时的行列号和层级
        // 下载失败时自动继续下载
        download(level, x, y)
    })
}

// 下载杭州范围内0到7级的数据
for(let i = 0; i < 8; i++) {
    download(i)
}
```

#### 下载全球数据
```
const downloadTile = require('./util')

function download(level, x, y) {
    downloadTile(level, {
        startX: x,
        startY: y
    }, (x, y, level) => {
        download(level, x, y)
    })
}

// 下载全球范围内0到7级的数据
for(let i = 0; i < 8; i++) {
    download(i)
}

```