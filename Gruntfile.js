module.exports = function(grunt) {

grunt.registerMultiTask('htmlfix', 'fix HTML', function () {
    var options = this.options();
    grunt.verbose.writeflags(options, 'Options');

    this.files.forEach(function (file) {
      var min;
      var content = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      })
      .map(grunt.file.read)
      .join(grunt.util.normalizelf(grunt.util.linefeed));

      var lines = grunt.util._.lines(content);
      var content2 = lines.join(",");

      var htmlEnd = /<\/div>,<\/body>,<\/html>,$/;
      if (! content2.match(htmlEnd) ) {
            htmlEnd = /<\/div>,<\/body>,$/;
            if ( ! content2.match(htmlEnd) ) {
		     htmlEnd = /<\/div>,$/;
		     if (! content2.match(htmlEnd) ) {
			     console.log("ne kontam =? error ", content2);
		     } else {
		         content = content + "\n</body>\n</html>";
		     }
	    } else {
		    content = content + "\n</html>";
	    }
      } 

      var linesNew = grunt.util._.lines(content);
      for (var i=0; i<3; i++)
	      linesNew.pop();
      linesNew.push("<!--(bake includes/disqus.html)-->");
      linesNew.push("</div>");
      linesNew.push("</body>");
      linesNew.push("</html>");

      content = linesNew.join("\n");

      if (content.length < 1) {
        grunt.log.warn('Destination not written because minified HTML was empty.');
      } else {
        grunt.file.write(file.dest, content);
        grunt.log.writeln('File ' + file.dest + ' created.');
      }
    });
  });
	
grunt.initConfig( {
 
   htmlfix: {
          standard: {
	      files: grunt.file.expandMapping("posts/**/*.html", "dest1"),	  
          }
   },

   bake: {
        posts: {
            options: {
			     content: "content.json",
                             section: ""
            },

            files: grunt.file.expandMapping("dest1/posts/**/*.html", "dest"),
       },

   },

/*
    log: {
            foo: [1, 2, 3],
	    bar: 'hello world',
	    baz: false
	  }
*/
});

grunt.loadNpmTasks( "grunt-bake" );

/*
grunt.registerMultiTask('log', 'Log stuff.', function() {
	  grunt.log.writeln(this.target + ': ' + this.data);
});
*/

grunt.registerTask('default', [	'htmlfix', 'bake']);


}
