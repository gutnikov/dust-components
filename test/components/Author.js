const cx = require('classnames');
const Button = require('./Button');

function Author(props) {
    return (
        <div className={cx('author', props.className)}>
            <div className="author-name">{props.name}</div>
            <div className="author-surname">{props.surname}</div>
            <Button className="button-vote" text="Like!"/>
        </div>
    );
}

module.exports = Author;

