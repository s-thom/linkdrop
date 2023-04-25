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

## [Unreleased](https://github.com/s-thom/linkdrop/compare/v1.7.0...HEAD) - DATE

### Changed

- Updated analytics

### Fixed

- Tags no longer appear out of order on links when searching

## [1.7.0](https://github.com/s-thom/linkdrop/compare/v1.6.3...v1.7.0) - 2023-04-09

### Added

- Add theme selection on the settings page
- Move user information to a new stats page
- The stats page now shows a list of the most commonly clicked on links

### Fixed

- Descriptions with long words no longer overflow the container
- Changed header re-render blocking to use the final API

## [1.6.3](https://github.com/s-thom/linkdrop/compare/v1.6.2...v1.6.3) - 2023-02-26

### Changed

- Redirect to link search page after creating a new link
  - The previous behaviour was to redirect to the new link page, which would effectively clear the form

### Fixed

- Your Links navigation item was incorrectly highlighted on the new links page

## [1.6.2](https://github.com/s-thom/linkdrop/compare/v1.6.1...v1.6.2) - 2023-02-12

### Added

- Goose

### Changed

- Hide the "log in" navigation link when on the login page when signing up is unavailable
  - This should stop some misclicks that lose state when logging in in the extensions

## [1.6.1](https://github.com/s-thom/linkdrop/compare/v1.6.0...v1.6.1) - 2023-01-21

### Added

- Firefox extension link
  - Requires Firefox 109+

## [1.6.0](https://github.com/s-thom/linkdrop/compare/v1.5.1...v1.6.0) - 2022-10-23

### Added

- Check for duplicate urls when saving a new link
- Allow tags in new link URLs

### Changed

- Upgrade dependencies
- Switched from Feather icons to Lucide icons
  - Lucide is a fork that is still getting maintained

## [1.5.1](https://github.com/s-thom/linkdrop/compare/v1.5.0...v1.5.1) - 2022-09-25

### Added

- Analytics through Umami.
  - No cookies/local/session storage.
  - Instance is hosted at [analytics.sthom.kiwi](https://analytics.sthom.kiwi), which most adblockers should detect by default.
  - Do Not Track header is respected.
  - Any paths with identifiable information are anonymised (e.g. tags are omitted during searches).

## [1.5.0](https://github.com/s-thom/linkdrop/compare/v1.4.0...v1.5.0) - 2022-09-24

### Added

- Required tags when searching.
  - By prefixing a tag with `+`, links must include the given tag in order to show up.
  - Combining with the existing `-`, this allows for much more granular searching.
- New help page, with information about searching and the different modifiers to tags

### Changed

- Login sessions last up to 30 days, instead of 7.
- Upgraded to React 18.
- Changed favicons to hopefully be more readable.

## [1.4.0](https://github.com/s-thom/linkdrop/compare/v1.3.2...v1.4.0) - 2022-05-01

### Added

- 2 factor authentication via TOTP (mobile authenticator).
- Accounts can be deleted from the account settings.
- Link to Chrome extension in a new page in the settings area.

### Changed

- The PWA install prompt has moved to the same page as the Chrome extension link.

### Fixed

- When searching for tags, excluded tags no longer show up in the suggestions.

## [1.3.2](https://github.com/s-thom/linkdrop/compare/v1.3.1...v1.3.2) - 2022-04-29

### Fixed

- Sharing URLs to the installed website in Android should work for realsies this time.

## [1.3.1](https://github.com/s-thom/linkdrop/compare/v1.3.0...v1.3.1) - 2022-04-28

### Fixed

- Sharing URLs to the installed website in Android should work better.

## [1.3.0](https://github.com/s-thom/linkdrop/compare/v1.2.0...v1.3.0) - 2022-04-28

### Added

- URL/description in new link page can come from URL parameters.

### Changed

- After adding a new link, you are no longer redirected to that link's page.
  - Instead, the form resets.

## [1.2.0](https://github.com/s-thom/linkdrop/compare/v1.1.0...v1.2.0) - 2022-04-26

### Added

- Tags can be excluded from a search by prefixing with a hyphen (e.g. `-example`)
  - As a result, tags can no longer start with a hyphen, but can still contain them in other places.

### Changed

- all tags much be lowercase.
- Tag suggestions are more relevant, based on which tags have appeared most commonly with the ones already selected.

## [1.1.0](https://github.com/s-thom/linkdrop/compare/v1.0.1...v1.1.0) - 2022-04-25

### Added

- Demo on landing page.
- User info page.
  - It has some basic info on it, like the number of links and the most commonly used tags.
  - In fact, that's all it has right now.
- Form to edit existing links.
- Better error pages.

### Changed

- Tag buttons on link cards are clickable in the search.

### Fixed

- Navigations getting lost on certain occasions when clicking back in your browser.

## [1.0.1](https://github.com/s-thom/linkdrop/compare/v1.0.0...v1.0.1) - 2022-04-25

### Added

- Tags are highlighted when searching, so it's easier to see why a particular link is included in the results.
- Manual sign up can be done by including a secret token in the request. Set the secret wisely.

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
