function flatten(args) {
    var flat = [];
    args.forEach(function (arg) {
        if (Array.isArray(arg)) {
            flat = flat.concat(arg);
        }
        else {
            flat.push(arg);
        }
    });
    return flat;
}

module.exports = function (tagName, props, ...children) {
    children = flatten(children);
    if (typeof tagName === 'function') {
        var ctr = tagName;
        var childProps = {};
        if (props) {
            childProps = Object.assign({}, props);
        }
        childProps.children = children;
        return ctr(childProps);
    }
    else {
        return {
            tagName,
            props,
            children
        };
    }
};
