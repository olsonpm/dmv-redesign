'use strict';


//---------//
// Imports //
//---------//

var ptr = require('promise-task-runner')
    , bPromise = require('bluebird')
    , nh = require('node-helpers')
    , path = require('path')
    , vFs = require('vinyl-fs')
    , http = require('http')
    , bFs = require('fs-bluebird')
    , streamToPromise = require('stream-to-promise')
    , bSassRender = bPromise.promisify(require('node-sass').render)
    , bRimraf = bPromise.promisify(require('rimraf'))
    , bMkdirp = bPromise.promisify(require('mkdirp'))
    , bNcp = bPromise.promisifyAll(require('ncp')).ncp;


//------//
// Init //
//------//

var CSS_DIR = 'css';

var PromiseTask = ptr.PromiseTask
    , PromiseTaskContainer = ptr.PromiseTaskContainer
    , Environment = nh.Environment;

var srcScss = 'src/client/assets/scss';


//------//
// Main //
//------//

var scssClean = new PromiseTask()
    .id('scssClean')
    .task(function() {
        var env = new Environment({
            hardCoded: this.globalArgs().env
        });
        var cssPath = path.join(process.cwd(), env.curEnv(), CSS_DIR);

        return bRimraf(cssPath)
            .then(function() {
                return bMkdirp(cssPath);
            });
    });

var scssBuild = new PromiseTask()
    .id('scssBuild')
    .dependencies(scssClean)
    .task(function() {
        console.log('scssBuild');
        var res;

        var env = new Environment({
            hardCoded: this.globalArgs().env
        });

        var cssOut = (env.isDev())
            ? 'index.css'
            : 'index.min.css';

        var destCss = path.join(env.curEnv(), CSS_DIR, cssOut);

        var nodeSassOpts = {
            file: path.join(srcScss, 'index.scss')
        };

        if (!env.isProd()) {
            nodeSassOpts.sourceMap = true;
            nodeSassOpts.outFile = cssOut;
        }

        if (env.isProd()) {
            nodeSassOpts.outputStyle = 'compressed';
        }

        var bCompileAndCopySass = bSassRender(nodeSassOpts)
            .then(function(successObj) {
                return bMkdirp(path.join(env.curEnv(), CSS_DIR))
                    .thenReturn(successObj);
            })
            .then(function(successObj) {
                var pRes;

                if (env.isProd()) {
                    pRes = bFs.writeFileAsync(destCss, successObj.css);
                } else {
                    pRes = bPromise.join(
                        bFs.writeFileAsync(destCss, successObj.css)
                        , bFs.writeFileAsync(destCss + '.map', successObj.map)
                    );
                }

                return pRes;
            });

        if (env.isProd()) {
            res = bCompileAndCopySass;
        } else {
            res = bPromise.join(
                bCompileAndCopySass
                , bNcp(srcScss, path.join(env.curEnv(), CSS_DIR))
            );
        }

        return res;
    });

var scssWatch = new PromiseTask()
    .id('scssWatch')
    .task(function() {
        var self = this;
        var env = new Environment({
            hardCoded: self.globalArgs().env
        });
        var watcher = vFs.watch(path.join(srcScss, "**/*"));
        var cssOut = (env.isDev())
            ? 'index.css'
            : 'index.min.css';

        var destCss = path.join(env.curEnv(), CSS_DIR, cssOut);
        watcher.on('change', function(fpath) {
            console.log('scssWatch');
            scssBuild.run()
                .then(function() {
                    var options = {
                        host: 'localhost'
                        , port: 35729
                        , path: '/changed?files=/' + destCss
                        , agent: false
                    };
                    http.get(options);
                });
        });
    });

//---------//
// Exports //
//---------//

module.exports = (new PromiseTaskContainer()).addTasks(scssClean, scssBuild, scssWatch);
