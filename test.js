var chron = require('./');
var loop = require("parallel-loop");
var assert = require('assert');


describe('default', function() {
  chron('default', function(t) { t.done() });
  it('should run default', function() {});
})

describe('tasks', function() {
  var count = 0;
  it('should run a simple task', function (done) {
    var chron1 = chron('foo bar', function (t) {
      setTimeout(function () {
        t.done();
        count++
        if (count < 3) {
          t.run();
        } else {
          assert.equal(count, 3);
          done();
        }
      }, 100);
    });

    assert.equal(chron1.key, 'foo-bar');
    assert.equal(chron1.name, 'foo bar');
    assert.equal(chron1.watching, undefined);
    assert.equal(chron1.path, undefined);
    chron1.run();

  });

//   it('do what I describe in examples', function (done) {
//     chron('bundle', chron.once('concat')
//       .path('./examples/chronic/bud.js', 'bundle.js')
//       .dest('./build'),
//       require('./bundle.js'));

//     // 'bundle' will wait for 'concat' to finish before starting, so I'm confident "chronic/bud.js" exists.

//     chron('concat', chron
//       .watch('./examples/one/*.js', './examples/two/*.js'), 
//       ctask);

//     function ctask(t) {
//       t.build(t.src(t.watching), concat('bud.js'), t.dest('./examples/chronic'));
//       // t.watching = ['./examples/params/*.js', './examples/params/*.js'] 
//     }

//     chron('css', chron
//       .path('./examples/**/*.css')
//       .transform(concat('style.css'))
//       .dest('./examples/build')),
//       chron.build); // chron.build is boilerplate that pumps everything together

// var paths = chron.path('./build/**').dest('./oven');

// chron('potato', paths, require('./potato.js'));
//   });

  it('should run a task with options', function (done) {

    chron('lorem ipsum', chron.watch('**/*.js', '**/*.css', '!node_modules/**'), function (t) {
      assert.deepEqual(t.watching, ['**/*.js', '**/*.css', '!node_modules/**']);
      assert.deepEqual(t.files('watching'), [ 'examples/build/a.js',
                                    'examples/build/b.js',
                                    'examples/build/c.js',
                                    'examples/build/dist.js',
                                    'examples/build/do.js',
                                    'examples/one/do.js',
                                    'examples/three/do.js',
                                    'examples/two/do.js',
                                    'index.js',
                                    'lib/cli.js',
                                    'lib/exec.js',
                                    'lib/map.js',
                                    'lib/options.js',
                                    'lib/run.js',
                                    'lib/task.js',
                                    'test.js',
                                    'examples/build/a.css',
                                    'examples/build/b.css',
                                    'examples/build/c.css',
                                    'examples/build/dist.css' ]);
      t.done();
      done();
    }).run();

  });

  it('should run multiple tasks paralelly', function (done) {
    var count = 0;
    loop(10, each, function () {
      assert.equal(count, 10);
      done();
    });

    function each (finish, i) {
      var isRunning = true;
      count++;
      var task1 = task('task ' + i, function (t) {
        assert.ok(isRunning);
        setTimeout(function () {
          isRunning = false;
          t.done();
        }, Math.floor(Math.random()*100));
      });
      task1.run(finish);
    }
  });

  it('should pass watched files and depend on other tasks', function (done) {

    var t1done = false;
    var t2done = false;
    var t3done = false;

    chron('foo 1', chron.path('examples/build/*.js').watch('examples/build/*.js'), function (t) {
      assert.deepEqual(t.path, [ 'examples/build/*.js' ]);
      assert.deepEqual(t.watching, [ 'examples/build/*.js' ]);
      assert.deepEqual(t.files(), t.files('path'));
      assert.deepEqual(t.files('path'), t.files('watching'));
      assert.deepEqual(t.files(), [ 'examples/build/a.js',
                                    'examples/build/b.js',
                                    'examples/build/c.js',
                                    'examples/build/dist.js',
                                    'examples/build/do.js' ]);
      setTimeout(function () {
        t.done();
        t1done = true;
      }, 50);
    });

    chron('bar 2', chron.path('examples/build/*.scss').dest('public').watch('examples/build/*.css'), function (t) {
      assert.deepEqual(t.path, [ 'examples/build/*.scss' ]);
      assert.equal(t.options._dest, 'public');
      assert.deepEqual(t.files(), [ 'examples/build/style.scss' ]);
      assert.notDeepEqual(t.files(), t.files('watching'));
      assert.deepEqual(t.files('watching'), [ 'examples/build/a.css',
                                              'examples/build/b.css',
                                              'examples/build/c.css',
                                              'examples/build/dist.css' ]);

      setTimeout(function () {
        t.done();
        t2done = true;
      }, 100);
    });

    var t3 = chron('qux', chron.once('foo 1', 'bar-2'), function (t) {
      assert.equal(t.files('path'), undefined);
      assert.deepEqual(t.watching, [ 'examples/build/*.js', 'examples/build/*.css' ]);
      assert.deepEqual(t.files(), t.files('watching'));
      assert.deepEqual(t.files(), [ 'examples/build/a.js',
                                    'examples/build/b.js',
                                    'examples/build/c.js',
                                    'examples/build/dist.js',
                                    'examples/build/do.js',
                                    'examples/build/a.css',
                                    'examples/build/b.css',
                                    'examples/build/c.css',
                                    'examples/build/dist.css' ]);
      setTimeout(function () {
        assert.ok(t1done);
        assert.ok(t2done);
        t3done = true;
        t.done();
      }, 10);
    });

    t3.run(function () {
      assert.ok(t3done);
      done();
    });
  });

  

})
