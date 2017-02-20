# AutoconfigApp

[![Build Status](https://travis-ci.org/bponomarenko/autoconfig-app.svg?branch=master)](https://travis-ci.org/bponomarenko/autoconfig-app)

This is UI for Autoconfig REST API. Written in Angular. Available as web site or Electron application.

[Project page](https://bponomarenko.github.io/autoconfig-app/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.31.

## Development server

Run `ng start:web` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
P.S.`ng start:web` will do two things:

1. Start local proxy on 3000 port to solve CORS restrictions in browser. For a proxy to work correctly, set `AUTOCONFIG_HOST` environment variable with Autoconfig API host as a value.
2. Start `ng serve`, which will start local dev server

Run `ng start:app` for a dev Electron app. Application will be opened automatically.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build:web` to build the project for web. The build artifacts will be stored in the `dist/web` directory (used with `-prod` flag for a production build).

Run `ng build:web4app` to build the project for the Electron wrapper app. The build artifacts will be stored in the `dist/web4app` directory. Usually used before `ng build:app` command.

Run `ng build:app` to build the Electron aplication with prebuilt web application inside.

## Mocks

To use project with mocked data, follow inline comments in `src/app/app.module.ts` and `src/app/services/environments.service.ts` to uncomment this functionality.

## Installation instructions

1. Go to [Releases page](https://github.com/bponomarenko/autoconfig-app/releases)
2. Select release version, preferably _latest_, and download _Autoconfig.API-[VERSION].dmg_ in the Downloads section.
3. Open dmg image. Installation screen will be open.
4. Drag-n-drop App to Applications folder.
5. Done. Check [Additional Information](#additional-information) section for more details.

## Additional Information

* [FAQ](docs/FAQ.md)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
