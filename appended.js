const fs = require('fs')
const path = require('path')

const env = process.env.NODE_ENV
console.log(`当前环境---------${env}`)
let readerStream;
if (env === "production") {
    readerStream = fs.createReadStream('pro_index.html');
}else if(env=== "ywtest"){
    readerStream = fs.createReadStream('yw_index.html');
}

if(readerStream){
    const outName = path.join(__dirname, './public', 'index.html')
    const writerStream = fs.createWriteStream(outName);
    readerStream.pipe(writerStream);
}




