const fs = require('fs');
const path = require('path');
const dust = require('dustjs-linkedin');
const walker = require('fs-walk');

const srcDir = 'templates';
const compiledDir = 'templates-compiled';

function compile(source, name) {
    return dust.compile(source, name);
}

function resultTemplate(code) {
    return `
    const dust = require('dustjs-linkedin');
${code}`;
}

function run() {
    if (!fs.existsSync(`./${compiledDir}`)) {
        fs.mkdirSync(`./${compiledDir}`);
    }
    walker.filesSync(`./${srcDir}`, function (dir, fileName) {
        const baseName = path.basename(fileName, '.dust');
        const result = compile(fs.readFileSync(`${dir}/${fileName}`, 'utf-8'), baseName);
        fs.writeFileSync(`./${compiledDir}/${baseName}.js`, resultTemplate(result));
        require(`./${compiledDir}/${baseName}.js`);
    });
}

module.exports = run;
