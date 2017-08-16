function Circle(props) {
    return (
        <circle cx={props.cx}
                cy={props.cy}
                r={props.r}
                stroke={props.stroke}
                strokeWidth={props.strokeWidth}
                fill={props.fill} />
    );
}

module.exports = Circle;

