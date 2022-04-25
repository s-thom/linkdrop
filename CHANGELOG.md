# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Deprecated -->
<!-- ### Removed -->
<!-- ### Fixed -->
<!-- ### Security -->

## [Unreleased](https://github.com/s-thom/linkdrop/compare/v1.0.0...HEAD)

### Added

- Form to edit existing links.

## [1.0.1](https://github.com/s-thom/linkdrop/releases/tag/v1.0.1) - 2022-04-25

### Added

- Tags are highlighted when searching, so it's easier to see why a particular link is included in the results.

### Changed

- Tag suggestions update with new tags as you add tags.
- Tag inputs are no longer capitalised on software keyboards (such as mobile).

### Fixed

- Sorting when there are no tags selected now uses the creation date properly.
- Any left-over input in the Add link's tag input is treated properly.
  - This fixes an issue where you could add invalid tags by submitting the form with an invalid value in the input.
- Removed "0" appearing in the common tags of the search form when using the app for the first time.

## [1.0.0](https://github.com/s-thom/linkdrop/releases/tag/v1.0.0) - 2022-04-24

### Added

- Login with email/password.
- Form to save links with descriptions and tags.
- Page to search for previously saved links by tag.
- Page to view an individual link.
  - Note: this page is publicly accessible, so you can share it. The randomness of the ID _should_ make it private enough.

### Removed

- Ability to sign up, since this is a personal project.  
  If you're interested in using this, then there are two main options:
  1. Host it yourself. The [default instructions](https://github.com/remix-run/blues-stack#deployment) should get you most of the way, but I may write something proper up later.
  2. If you know me IRL, then ask me about it.
