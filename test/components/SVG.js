function SVG(props) {
    return (
        <svg width={props.width} height={props.height}>
            {props.children}
            Sorry, your browser does not support inline SVG.
        </svg>
    );
}

module.exports = SVG;
