var HTMLAttributes = require('./HTMLAttributes');
var SVGAttributes = require('./SVGAttributes');

function helperFactory(dust) {
    // TODO: This is obviously not correct, have to find a way to do this in correct form
    function renderSync(body, context) {
        var html = 'ops, this finally failed';
        dust.render(body, context, function (err, output) {
            html = output;
        });
        return html;
    }

    return function (componentFn) {
        return componentAdapter(componentFn, renderSync);
    };
}

function componentAdapter(componentFn, renderSync) {
    return function (chunk, context, bodies, params) {
        var props = {
            children: renderSync(bodies.block, context)
        };
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                if (typeof params[key] === 'function') {
                    props[key] = renderSync(params[key], context);
                }
                else {
                    props[key] = params[key];
                }
            }
        }
        chunk.write(renderNode(componentFn(props), chunk, context, bodies.block));
    };
}

function renderNode(node) {
    var tag = tagParts(node.tagName, node.props);
    var children = node.children.map(function (childNode) {
        if (typeof childNode === 'string') {
            return childNode;
        }
        else {
            return renderNode(childNode);
        }
    });
    return [tag.open, ...children, tag.close].join('\n');
}

function tagParts(tagName, attributes) {
    var attributesRendered = printAttributes(attributes);
    return {
        open: `<${tagName} ${attributesRendered}>`,
        close: `</${tagName}>`
    };
}

function getTagAttributeName(attributeName) {
    return HTMLAttributes.getHTMLAttributeName(attributeName) ||
           SVGAttributes.getSVGAttributeName(attributeName);
}

function printAttributes(attributes) {
    var result = [];
    for (var key in attributes) {
        if (attributes[key] !== undefined) {
            var attributeName = getTagAttributeName(key);
            if (attributeName) {
                if (typeof attributes[key] === 'boolean' &&
                    HTMLAttributes.attributeHasBooleanValue(key)) {
                    if (attributes[key]) {
                        result.push(`${attributeName} `);
                    }
                }
                else {
                    result.push(`${attributeName}="${attributes[key]}" `);
                }
            }
        }
    }
    return result.join('');
}

module.exports = helperFactory;
