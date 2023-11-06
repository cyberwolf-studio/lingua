# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [0.9.40] - 2023-11-06

This version brings **breaking changes**.

+ Local plugins ref, named `locale` was removed, cause user will not be able to manipulate it anymore.
+ The `setLocale` function for removed, because of change described earlier.
+ No need to pass `locale` in plugin's options.


### Fixed
- [Locale change reactive](https://github.com/cyberwolf-studio/lingua/issues/6)
