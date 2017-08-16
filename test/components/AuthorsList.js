const cx = require('classnames');
const Author = require('./Author');

function AuthorsList(props) {
    const authors = props.authors || [];    
    return (
        <div className="authors-list">
            {
                authors.map(function (author) {
                    return <Author className={cx(props.itemClass)} name={author.name} surname={author.surname}/>;
                })
            }
        </div>
    );
}

module.exports = AuthorsList;
