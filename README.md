# Dust Components #

Migrate your *Dust.js* codebase to pure components and *jsx* ( bit by bit ).

## Motivation ##

This project might be interesting for those who decided to migrate to React but already has a codebase 
built with *Dust.js*. With dust-components it's possible to use pure *React* components as regular dust helpers.
It means that you can rewrite your codebase bit-by-bit replacing existing markup with pure components. 

## Quick example ##

Lets go through some refactoring steps of an example template:

```html
<div>
    <div class="container {containerClass}">
        <h1>{containerHeaderText}</h1>
        <div class="container-body">
            {#authors}
                <div class="author {itemClass}">
                    <div class="author-name">{name}</div>
                    <div class="author-surname">{surname}</div>
                    <button class="button button-vote">Like!</button>
                </div>
            {/authors}
        </div>
    </div>
</div>
```

At every step we will extract some part of a template markup into a component.

### Step 1: Button ###

```javascript
const cx = require('classnames');

function Button(props) {
    return (
        <button className={cx('button', props.className)}
                name={props.name}
                id={props.id}
                disabled={props.disabled}>{props.text}</button>
    );
}

module.exports = Button;

```

After we imported and registered it (see *how to setup* section) we can rewrite original template as follows:

```html
<div>
    <div class="container {containerClass}">
        <h1>{containerHeaderText}</h1>
        <div class="container-body">
            {#authors}
                <div class="author {itemClass}">
                    <div class="author-name">{name}</div>
                    <div class="author-surname">{surname}</div>
                    {@Button className="button-vote" text="Like!"/}
                </div>
            {/authors}
        </div>
    </div>
</div>
```

### Step 2: Author ###

```javascript
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
```

Refactored template:

```html
<div>
    <div class="container {containerClass}">
        <h1>{containerHeaderText}</h1>
        <div class="container-body">
            {#authors}
                {@Author className="{itemClass}" name="{name}" surname="{surname}"/}
            {/authors}
        </div>
    </div>
</div>
```

> Note: notice that button's component could be used both in dust templates as a 
> helper and in other components as a regular component.

### Step 3: AuthorsList ###

```javascript
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
```

Refactored template:

```html
<div>
    <div class="container {containerClass}">
        <h1>{containerHeaderText}</h1>
        <div class="container-body">
            {@AuthorsList itemClass="{itemClass}" authors=authors/}
        </div>
    </div>
</div>
```

### Step 4: Container ###

```javascript
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
```

Refactored template:

```html
<div>
    {@Container className="{containerClass}" headerText="{containerHeaderText}"}
        {@AuthorsList itemClass="{itemClass}" authors=authors/}
    {/Container}
</div>
```

### Refactoring result ###

* Most part of existed code migrated to isolated components, compatible with React
* *Dust.js* template slimmed down to it's minimum declarative form


## How to setup ##

### Install dust-component as project dependency ###

with npm:
```bash
npm i --save dust-components
```

with yarn:
```bash
yarn add dust-components
```

### Set up component transformation ###

To be able to use components in *dust* we have to provide custom pragma function when transforming them from jsx:

```javascript
{
    loader: 'babel-loader',
    options: {
    plugins: [
        ["transform-react-jsx", {
            "pragma": "dcNode"
        }]
    ]
},
    
// ...
    
plugins: [
    new webpack.ProvidePlugin({
        dcNode: ['dust-components', 'pragmaFunction']
    })
]
```


### Register components ###

After components has been transformed and bundled you have to register it as *dust helpers*. 
In order to do that use *HelperFactory* that goes with this repo:

```javascript
// Import components:
const Button = require('components/Button');
const Author = require('components/Author');
const AuthorsList = require('components/AuthorsList');
const Container = require('components/Container');

// Setup helper factory:
const dust = require('dustjs-linkedin');
const createHelper = require('dust-components').HelperFactory(dust);

// Register components:
dust.helpers['Button'] = createHelper(Button);
dust.helpers['Author'] = createHelper(Author);
dust.helpers['AuthorsList'] = createHelper(AuthorsList);
dust.helpers['Container'] = createHelper(Container);
```

>
> Note: probably it's a good idea to generate such registration code on build phase
>


## Tests ##

To run project tests:

```bash
yarn run test
```

Check project tests directory to see migration examples from this README, other usecases or to add more tests.

## Implementation notes ##

TODO:
