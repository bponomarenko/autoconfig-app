# AutoconfigApp

[![Build Status](https://travis-ci.org/bponomarenko/autoconfig-app.svg?branch=master)](https://travis-ci.org/bponomarenko/autoconfig-app)

This is UI for Autoconfig REST API. Written in Angular. Available as web site or Electron application.

[Project page](https://bponomarenko.github.io/autoconfig-app/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.31.

## Q&A

#### I can't open application because it's "from unidentified developer"

This is default MacOS protection, which can be easily workarounded. To open application perform the following steps:
1. Open Finder and navigate to /Applications (default location for Applications).
2. Find the application in the foler.
3. Right-click on the application.
4. Select Open.
5. You will see prompt warning the application is from an unidentified developer. Click Open to continue.

Another way is to open application is from Terminal:
1. Open Terminal application.
2. Execute the following command to run Autoconfig app:
```bash
/Applications/Autoconfig\ API.app/Contents/MacOS/Autoconfig\ API; exit;
```

#### Application is loaded, but I don't see any data

Autoconfig API is only available from withing Company network. Make sure you are connected with VPN or physically in the office.

## Development server

Run `ng start:web` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
P.S.`ng start:web` will do two things:
1. Start local proxy on 3000 port to solve CORS restrictions in browser
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

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
