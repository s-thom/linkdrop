# [linkdrop](https://linkdrop.sthom.kiwi)

![Screenshot of linkdrop](/.github/media/hero.png "Screenshot of linkdrop")

linkdrop is a web app that saves links so you can search for them later.

## Features

- Saving links with tags
- Searching for links with tags
- It's a small feature set, but I think it does it well.

## History

This is a reimagination of a previous project, called [the-index](https://github.com/s-thom/the-index). I stopped working on that project because hosting data is hard, and writing new code is fun. Maybe that's why I have so many almost-finished projects lying around...

Anyway, this was a good opportunity to experiment with the framework-du-jour, and see what tradeoffs it makes. Now I just need to remember to use it to save links.

## Development

This project is based on the [Remix Blues stack](https://github.com/remix-run/blues-stack). The README of that project is the best starting place for information.

```sh
npm ci
npm run docker
npm run setup
npm run build
# and finally
npm run dev
```
