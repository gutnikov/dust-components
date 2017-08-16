const fs = require('fs');
const path = require('path');
const dust = require('dustjs-linkedin');
const babel = require('babel-core');
const walker = require('fs-walk');
const mkdirp = require('mkdirp').sync;
const createHelper = require('../src/HelperFactory')(dust);

const srcDir = 'components';
const tfmDir = 'components-transformed';

function transformJsx(code) {
    return babel.transform(code, {
        plugins: [['babel-plugin-transform-react-jsx', {
            pragma: 'node'
        }]]
    }).code;
}

function resultTemplate(code, componentsPath) {
    return `const node = require('../${componentsPath}/src/pragmaFunction.js');
${code}`;
}

function run() {
    if (!fs.existsSync(`./${tfmDir}`)) {
        fs.mkdirSync(`./${tfmDir}`);
    }
    const componentFiles = [];
    walker.filesSync(`./${srcDir}`, function (dir, fileName) {
        const relPath = path.relative(srcDir, path.join(dir, fileName));
        const revRelPath = path.relative(path.join(dir, fileName), srcDir);
        const result = transformJsx(fs.readFileSync(`${dir}/${fileName}`, 'utf-8'));
        mkdirp(`./${tfmDir}/${path.dirname(relPath)}`);
        fs.writeFileSync(`./${tfmDir}/${relPath}`, resultTemplate(result, revRelPath));
        componentFiles.push(relPath);
    });
    componentFiles.forEach(function (fileName) {
        const fn = require(`./${tfmDir}/${fileName}`);
        const name = fileName.replace(/\//g, '.').replace(/\.js$/,'');
        dust.helpers[name] = createHelper(fn);
    });
}

module.exports = run;
