// 需要先安装依赖: npm install sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 读取SVG文件
const svgBuffer = fs.readFileSync(path.join(__dirname, 'synthmind_logo.svg'));

// 转换为PNG
sharp(svgBuffer)
  .resize(600) // 可以调整大小
  .toFile('synthmind_logo.png', (err, info) => {
    if (err) {
      console.error('转换失败:', err);
    } else {
      console.log('成功将SVG转换为PNG!');
      console.log(info);
    }
  }); 