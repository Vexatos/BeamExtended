var fs = require('fs');

var stylesheets = {};

var files = fs.readdirSync('StyleSheets/source/');
for (var i in files) {
    if (!files.hasOwnProperty(i)) continue;
    if (files[i] == 'modules') continue;
    stylesheets['StyleSheets/' + files[i].split('.scss').join('.css')] = 'StyleSheets/source/' + files[i];
}

module.exports = function(grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: stylesheets
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['sass']);

};