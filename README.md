# AutoconfigApp

[![Build Status][build-img]][build-link]
[![GitHub issues][issues-img]][issues-link]

This is UI for Autoconfig REST API. Written in Angular. Available as web site or Electron application.

[Download latest version](https://github.com/bponomarenko/autoconfig-app/releases/latest)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.31.

## Installation instructions 

You can find installation instructions on [this page][install-link].

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

Run `npm run build:app` to build the Electron application with prebuilt web application inside.

## Mocks

To start project with mocked data, run the following command in terminal `npm run start:mocks`

## Additional Information

* [Wiki][wiki-link]
* [Angular CLI README][ng-readme]

[build-img]: https://travis-ci.org/bponomarenko/autoconfig-app.svg?branch=master
[build-link]: https://travis-ci.org/bponomarenko/autoconfig-app
[issues-img]: https://img.shields.io/github/issues/bponomarenko/autoconfig-app.svg
[issues-link]: https://github.com/bponomarenko/autoconfig-app/issues
[install-link]: https://github.com/bponomarenko/autoconfig-app/wiki/Installation-Instructions
[wiki-link]: https://github.com/bponomarenko/autoconfig-app/wiki
[ng-readme]: https://github.com/angular/angular-cli/blob/master/README.md
