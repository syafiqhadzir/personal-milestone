**Dependencies**

Summary of important behavior differences.

**dependencies** are installed on both:

- <kbd>npm install</kbd> from a directory that contains package.json
- <kbd>npm install</kbd> $package on any other directory

**devDependencies** are:

- also installed on <kbd>npm install</kbd> on a directory that contains package.json, unless you pass the <kbd>--production</kbd> flag.
- not installed on <kbd>npm install "$package"</kbd> on any other directory, unless you give it the <kbd>--dev</kbd> option.
- are not installed transitively.

**peerDependencies**:

- before 3.0: are always installed if missing, and raise an error if multiple incompatible versions of the dependency would be used by different dependencies.
- expected to start on 3.0 (untested): give a warning if missing on npm install, and you have to solve the dependency yourself manually. When running, if the dependency is missing, you will get an error.
- in version 7 peerDependencies are automatically installed unless an upstream dependency conflict is present that cannot be automatically resolved.

**Transitivity**:

- <kbd>dependencies</kbd> are installed transitively: if A requires B, and B requires C, then C gets installed, otherwise, B could not work, and neither would A.

- <kbd>devDependencies</kbd> is not installed transitively. E.g. we don't need to test B to test A, so B's testing dependencies can be left out.
