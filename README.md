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

Then, create bb.config.js
```sh
# bb.config.js
const componentConfig = {
	source: './component/', // 模板源
	output: './src/components/${HEAD_UPPER(name)}/', // 输出文件路径
	queue: [
		{
			template: 'map.js', // 模板文件
			filename: '../index.js', // 输出文件
			progress: function (compiler) { // 钩子函数：bb-plugin-add@0.3.x及以上支持
        const content = "export { ${HEAD_UPPER(name)}, example as ${HEAD_UPPER(name)}Example} from './${HEAD_UPPER(name)}'";
        // 在/** @bb-mt add */前插入内容
				compiler.comment('add').before.insert(content);
			}
		},
    {
      template: 'index.js',
      filename: 'index.js'
    },
		{
			template: 'component.vue',
			filename: '${HEAD_UPPER(name)}.vue'
		},
		{
			template: 'component.less',
      filename: '${HEAD_UPPER(name)}.less'
    },
    {
      template: 'componentConstants.js',
      filename: '${HEAD_UPPER(name)}Constants.js'
    },
    {
      template: 'example/index.js',
      filename: 'example/index.js'
    },
    {
      template: 'example/exampleCode.vue',
      filename: 'example/exampleCode.vue'
    },
    {
      template: 'example/exampleCodeConstants.js',
      filename: 'example/exampleCodeConstants.js'
    },
    {
      template: 'example/exampleCodeStyle.less',
      filename: 'example/exampleCodeStyle.less'
    }
	]
};

module.exports = {
	add: {
		component: componentConfig
	}
};
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
