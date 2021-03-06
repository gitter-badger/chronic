# chronic

*adjective*: from Greek *khronikos* ‘of time,’ from *khronos* ‘time.’

[![NPM](https://nodei.co/npm/chronic.png)](https://nodei.co/npm/chronic/)

[![Build Status](https://travis-ci.org/RnbWd/chronic.svg?branch=master)](https://travis-ci.org/RnbWd/chronic)
[![Dependency Status](https://img.shields.io/david/rnbwd/chronic.svg?style=flat-square)](https://david-dm.org/rnbwd/chronic)
[![Stability Status](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)](https://github.com/dominictarr/stability#experimental)


```bash
npm install chronic --save-dev
```

## Background

My goal is to provide a balance between *configuration and customization* through the creation of *task-transducers*. This library is now a heavily modified version of azer's [bud](https://github.com/azer/bud) and gulp's [vinyl-fs](https://github.com/wearefractal/vinyl-fs). Rationale for this project can be found [here](https://github.com/rnbwd/chronic/blob/master/RATIONALE.md).

Please read the [CHANGELOG](https://github.com/rnbwd/chronic/blob/master/CHANGELOG.md)

The API internals recently went through some final namespace orientation, which may result in breaking changes to current code, but the API is now stable.


## Usage

``` js
var chron = require('chronic');

chron('default', chron.after('task2'), function(t) {
  t.exec('echo dat {bud}!', t.params);
});

chron('task1', chron.source('./one/**').dest('./two'), chron.build)

chron('task2', chron.after('task1'), tasktwo);

function tasktwo(t) {
  t.build(t.src('./two/**'), t.dest('./three'));
}
```
- Run:

```bash
$ node <filename> --bud=chronic
```

- Should run 'task1', 'task2', then 'default' in that order, returning this output:

```bash
  default  Running...
  task2    Running...
  task1    Running...
  task1    Completed in 6ms
  task2    Completed in 7ms
  default  Executing "echo dat chronic!"
  default  dat chronic!
  default  Completed in 10ms
```

### Command Line Usage

- To run tasks:

```bash
$ node <filename> <tasks> <params>
```

- to watch files:

```bash
$ node <filename> -w # or --watch
```

- to list available tasks in a file:

```bash
$ node <filename> -l # or --list
```

## API

### chronic(task, [opts, func])

* `task` a string used to name tasks.
* `opts` a chainable series chronic methods.
* `func` a function that contains the paramater `t`, optionally use [chronic.build](#chronicbuild)

#### opts:

* `chronic.after` a comma separated list of tasks (strings)
  - list of tasks that should be *run and completed* prior calling `func`
  - may be used without `func` eg: `chron('default', chron.after('task'))`
* `chronic.source` an array or commma separated list of globby strings passed to `vinyl.src` (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.src()` and `t.files`
* `chronic.dest` a single string
  - passed down to `t.dest()` and  `t.path`
* `chronic.watch` an array or commma separated list of globby strings to watch (see [globby](https://github.com/sindresorhus/globby))
  - passed down to `t.watching`
* `chronic.transform` a comma separated list of functions that are stream transforms
  - these functions are piped inbetween `t.src` and `t.dest` if `chronic.build` is used
  - only gulp-plugins can safely be used at the moment


#### *func(* **t** *)* :

* `t.done` - callback which determines if a task has completed
  - optionally pass in an error `t.done([err])`
* `t.src` - returns `vinyl.src` *(gulp.src)*
  - if `chronic.source` is defined, calling `t.src()` is populated with the content of `t.files`
  - this can be easily overridden by defining `t.src('glob')` manually
* `t.dest` - returns `vinyl.dest` *(gulp.dest)*
  - if `chronic.dest` is defined, calling `t.dest()` is populated with the content of `t.path`
  - this can also be overriden
* `t.build` - returns an instance of [pump](https://github.com/mafintosh/pump) that calls `t.done` upon completion or error of stream
  - example: `t.build(t.src(), t.dest())`
* `t.exec` - returns formatted [npm-execspawn](https://github.com/mafintosh/npm-execspawn) calling `t.done()` upon completion
  - uses [format-text](https://www.npmjs.com/package/format-text) instead of looking for env variables
  - example: `t.exec('echo hello {place}!', {place: 'world'})`

------

* `t.params` - paramaters returned from command line
* `t.files` - returns an array of strings from `chronic.source`
* `t.path` - returns an array of strings from `chronic.dest`
* `t.watching` - returns an array of files from `chronic.watch`
   - used internally to watch files being watched,
* `t.source` - returns [vinyl-source-stream](https://www.npmjs.com/package/vinyl-source-stream)
* `t.buffer` - return [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer)
* `t.pump` - returns [pump](https://www.npmjs.com/package/pump)
* `t.eos` - returns [end-of-stream](https://www.npmjs.com/package/end-of-stream)

#### chronic.build

- returns `function(t)` with `pump(t.src(), -> [transforms], -> t.dest())`, returning `t.done` upon completion or error
- this method is syntactical sugar over the most common use pattern of this library


## TODO

More examples and tests and stuff coming soon!!

## License

MIT
