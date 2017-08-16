const cx = require('classnames');

// Simple button component with className and inner text
function Button(props) {
    return (
        <button className={cx('button', props.className)}
                name={props.name}
                id={props.id}
                disabled={props.disabled}
                data-undefined-value={props.undefinedValue}
                data-max-clicks={props.maxClicksBeforeExplode}>{props.text}</button>
    );
}

module.exports = Button;
