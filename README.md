# bb-plugin-add

[![npm](https://img.shields.io/npm/v/npm.svg)][![npm version](https://badge.fury.io/js/bb-plugin-add.svg)](https://badge.fury.io/js/bb-plugin-add)[![Build Status](https://travis-ci.org/xgfe/bb-plugin-add.svg?branch=master)](https://travis-ci.org/xgfe/bb-plugin-add)

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
create some template files:
```sh
$ mkdir my-component && cd my-component
# my-template.vue
```
Execute cli: bb add my-component test.
Now, a folder named test with test.vue exist in root path.

## Keywords

```sh
# for example, edit template file like this
# project name is ${name}
export { default as ${name}} from "${name}"
```

### Build-in Keywords

You can use build-in keywords below:

- `name`
  Name user input.
- `datetime`
  Datetime in os.
- `fullname`
  Username in os.
- `gitname`
  Username in git.
- `email`
  Email of git.

### Self-defining Keywords

You can set up self-defining keywords in config.json:

```sh

```

## Match Rules

Symbol increase
- `+keyword|[type]`
  increase symbol.
- `left>right`
```sh
# example
bb add component left>right
```
- `left-right`
- ``

```sh
# if self-defining keyword is equal to build-in keyword, build-in keyword will be override!
{
  "keywords":{
    "myname":"tom"
  }
}
```

## Naming Standard

# build-in function
```sh

```

## License

MIT