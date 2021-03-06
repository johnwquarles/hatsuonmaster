'use strict';

import path from 'path';
import del from 'del';

export default function(gulp, plugins, args, config, taskTarget, templateTarget, browserSync) {
  let dirs = config.directories;

  // Clean
  gulp.task('clean', del.bind(null, [
    path.join(dirs.temporary),
    path.join(dirs.destination),
    path.join(dirs.templatesDestination)
  ]));
}
