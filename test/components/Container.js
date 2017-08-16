const cx = require('classnames');

function Container(props) {
    return (
        <div className={cx('container', props.className)}>
            <h1>{props.headerText}</h1>
            <div className="container-body">
                {props.children}        
            </div>
        </div>
    );
}

module.exports = Container;
