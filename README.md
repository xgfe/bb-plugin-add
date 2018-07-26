# bb-plugin-add

[![npm version]](https://img.shields.io/npm/v/npm.svg) [![npm version](https://badge.fury.io/js/bb-plugin-add.svg)](https://badge.fury.io/js/bb-plugin-add) [![Build Status](https://travis-ci.org/xgfe/bb-plugin-add.svg?branch=master)](https://travis-ci.org/xgfe/bb-plugin-add)

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

You can set up self-defining keywords in config.json

## Naming Standard

- Function

## Build-in Functions

- UPPERCASE
- LOWERCASE
- HASH
- HEAD_UPPER
- HEAD_LOWER
- GAP_HYPHEN
- GAP_UNDERSCORE
- CSS_CLASS_HYPHEN_STYLE

## License

MIT