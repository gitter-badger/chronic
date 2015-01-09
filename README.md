# chronic 

*adjective*: from Greek *khronikos* ‘of time,’ from *khronos* ‘time.’

[![NPM](https://nodei.co/npm/chronic.png)](https://nodei.co/npm/chronic/)

[![Build Status](https://img.shields.io/travis/codingalchemy/chronic.svg?style=flat-square)](https://travis-ci.org/codingalchemy/chronic)
[![Dependency Status](https://img.shields.io/david/codingalchemy/chronic.svg?style=flat-square)](https://david-dm.org/codingalchemy/chronic)
[![Stability Status](https://img.shields.io/badge/stability-unstable-orange.svg?style=flat-square)](https://github.com/dominictarr/stability#experimental)

```bash
npm install chronic --save-dev
```

## Background

This library is built on top of azer's [bud](https://github.com/azer/bud) and gulp's [vinyl-fs](https://github.com/wearefractal/vinyl-fs). Rationale for this project can be found [here](https://github.com/codingalchemy/chronic/blob/master/RATIONALE.md).
*The API internals of this libary are very much in flux and subject to change*


## Usage

``` js
var chron = require('chronic');
var del = require('del');

chron('first task', chron.src('./one/**').dest('./two'), chron.build)

chron('another task', chron.once('first task'). function(t) {
  t.build(t.src('./two/**'), t.dest('./three'));
});

chron('default', chron.once('another task'), function(t) {
  t.done();
});


```

## API

### chronic(task, opts, [func])

- `task` a string, works similarly to `gulp.task('task', function(..))`. Used to name tasks. 
- `opts` must contain a chainable series methods chronic. Built on top of azer's [bud](https://github.com/azer/bud#running-tests-and-restarting-when-files-change).
- `func` is a function that contains the paramater `t`, also built on top of bud, works similar to gulp.

#### opts:

- `chronic.once` a comma separated list of strings (tasks). 
  - a list of tasks which should run *and completed* prior to this task starting
- `chronic.path` accepts a glob of string(s), either in an array or commma separated. Passed down to `t.src('path')` and `t.files`
- `chronic.watch` accepts a glob of string(s), either in an array or commma separated. Passed down to `t.watching` and `t.files`
- `chronic.transform` accepts a comma separated list of functions that are stream transforms. Using the gulp ecosystem, these would be gulp plugins. 
- `chronic.dest` accepts a string which is passed down to `t.dest('path')`.

#### t:



## License

MIT