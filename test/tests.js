/*eslint-disable no-undef*/
const fs = require('fs');
const path = require('path');
const dust = require('dustjs-linkedin');
const expect = require('chai').expect;
const components = require('./prepareComponents');
const templates = require('./prepareTemplates');
const prettier = require('prettier');
const walker = require('fs-walk');
const srcDir = 'templates';

describe('Simple', function () {

    // Compile components to jsx, and templates to js, register component
    before(function () {
        components();
        templates();
    });

    // Take every file in templates, compile it with dust
    // and compare to expected output
    walker.filesSync(`./${srcDir}`, function (dir, fileName) {
        templateTestRun(path.basename(fileName, '.dust'));
    });

});

function templateTestRun(templateName) {
    it(`should properly render template ${templateName}`, function (done) {
        const templatePath = `./expected/${templateName}.html`;
        const dataPath = `./data/${templateName}.json`;
        expect(fs.existsSync(templatePath)).to.equal(true);
        let data = {};
        if (fs.existsSync(dataPath)) {
            data = require(dataPath);
        }
        const expected = prettier.format(fs.readFileSync(templatePath, 'utf-8'));
        dust.render(templateName, data, function (err, output) {
            const result = prettier.format(output);
            expect(err).to.equal(null);
            expect(result).to.equal(expected);
            done();
        });
    });
}
