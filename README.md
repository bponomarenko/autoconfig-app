# AutoconfigApp

[![Build Status][build-img]][build-link]
[![GitHub issues][issues-img]][issues-link]

This is UI for Autoconfig REST API. Written in Angular. Available as web site or Electron application.

[Download latest version](https://github.com/bponomarenko/autoconfig-app/releases/latest)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.31.

## Installation instructions (for OSX)

1. Go to [Releases page](https://github.com/bponomarenko/autoconfig-app/releases)
2. Select release version, preferably _latest_, and download _autoconfig-app-[VERSION].dmg_ from the Downloads section.
3. Open dmg image. Installation screen will be open.
4. Drag-n-drop App to Applications folder.
5. Navigate to Applications folder in Finder.
6. Find _Autoconfig API_ application. Right click on application and select Open.
7. Confirmation dialog will be shown. Click Open button again on configuration dialog.

Steps 5-7 should be done just once, when application is opened for the first time. Check [Additional Information](#additional-information) section for more details.

## Development server

Run `npm run start:web` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
P.S.`npm run start:web` will do two things:

1. Start local proxy on 3000 port to solve CORS restrictions in browser. For a proxy to work correctly, set `AUTOCONFIG_HOST` environment variable with Autoconfig API host as a value.
2. Start `ng serve`, which will start local dev server

Run `npm run start:app` for a dev Electron app. Application will be opened automatically.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `npm run build:web` to build the project for web. The build artifacts will be stored in the `dist/web` directory (used with `-prod` flag for a production build).

Run `npm run build:web4app` to build the project for the Electron wrapper app. The build artifacts will be stored in the `dist/web4app` directory. Usually used before `npm run build:app` command.

Run `npm run build:app` to build the Electron aplication with prebuilt web application inside.

## Mocks

To start project with mocked data, run the following command in terminal `npm run start:mocks`

## Additional Information

* [FAQ](https://github.com/bponomarenko/autoconfig-app/wiki/FAQ)
* [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md)

[build-img]: https://travis-ci.org/bponomarenko/autoconfig-app.svg?branch=master
[build-link]: https://travis-ci.org/bponomarenko/autoconfig-app
[issues-img]: https://img.shields.io/github/issues/bponomarenko/autoconfig-app.svg
[issues-link]: https://github.com/bponomarenko/autoconfig-app/issues
