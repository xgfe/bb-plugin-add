# bb-plugin-add

[![npm version](https://badge.fury.io/js/bb-plugin-add.svg)](https://badge.fury.io/js/bb-plugin-add) [![Build Status](https://travis-ci.org/xgfe/bb-plugin-add.svg?branch=master)](https://travis-ci.org/xgfe/bb-plugin-add)

A self-defining module generator plugin for bb-mt

## Get Start

First, you should install bb and this plugin:
```sh
$ npm install -g bb-mt bb-plugin-add
```
Next, create your own project folder and run init:
```sh
$ mkdir my-project && cd my-project
$ bb init
```
Now, We find .tpl in root path.
```sh
$ cd .tpl
```

Then, create config.json:
```sh
# config.json
{
  "my-component":{
    "path":"./my-component"
  }
}
```

## Usage

```
bb add component MyComponent
```

## Keywords

```sh
# For example, edit template file like this
# Entity name is ${name}
export { default as ${name}} from "${name}"
```

### Build-in Keywords

You can use build-in keywords below:

- `name`
  Your entity name.
- `datetime`
  Datetime in os.
- `fullname`
  Username in os.
- `gitname`
  Username in git.
- `email`
   Email of git.

### Self-defining Keywords

You can set up self-defining keywords in config.json

## Build-in Functions

- `UPPERCASE`  MyComponent  -  MYCOMPONENT
- `LOWERCASE`  MyComponent  -  mycomponent
- `HEAD_UPPER`  myComponent  -  MyComponent
- `HEAD_LOWER`  MyComponent  -  myComponent
- `GAP_HYPHEN`  MyComponent  -  -my-component
- `GAP_UNDERSCORE`  MyComponent  -  _my_component
- `CSS_CLASS_HYPHEN_STYLE`  MyComponent  -  my-component

## Thanks

@feyy

## License

MIT