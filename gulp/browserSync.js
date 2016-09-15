'use strict';

export default function(gulp, plugins, args, config, taskTarget, templateTarget, browserSync) {
  // BrowserSync
  gulp.task('browserSync', () => {
    browserSync.init({
      open: args.open ? 'local' : false,
      startPath: '/',
      port: config.port || 3000,
      server: {
        baseDir: templateTarget,
        routes: (() => {
          let routes = {};

          // Map base URL to routes
          routes[`/${config.baseUrl}`] = taskTarget;

          return routes;
        })()
      }
    });
  });
}
