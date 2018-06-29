# bb-plugin-add
a self-defining module generator plugin for bb-mt

## Get Start

First, you should install bb and this plugin:
```sh
$ npm install -g bb bb-plugin-add

```
Next, create your own project folder and init:
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

## Template Match Keyword

```sh
# for example, edit template file like this
// project name is ${name}
export { default as ${name}} from "${name}"
```

First, you can use build-in keywords to defined specific info.

- `name`
  Name of user input.
- `datetime`
  System time.
- `fullname`
  Default username of system.
- `gitname`
  Username of git.
- `email`
  Email of git.

Also, you can use self-defining keywords.

Edit .tpl/config.json manually.

```sh
# if self-defining keyword is equal to build-in keyword, build-in keyword will be override!
{
  "keywords":{
    "myname":"tom"
  }
}
```


## License

MIT