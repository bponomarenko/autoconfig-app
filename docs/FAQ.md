# FAQ

- [I can't open application because it's "from unidentified developer"](#i-cant-open-application-because-its-from-unidentified-developer)
- [Application is loaded, but I don't see any data](#application-is-loaded-but-i-dont-see-any-data)
- [Where is my credentials are stored?](#where-is-my-credentials-are-stored)

If you didn't found an answer on your question here, please open an issue.

## I can't open application because it's "from unidentified developer"

This is default MacOS protection, which can be easily workarounded. To open application perform the following steps:

1. Open Finder and navigate to /Applications (default location for Applications).
2. Find the application in the folder.
3. Right-click on the application.
4. Select Open.
5. You will see prompt warning the application is from an unidentified developer. Click Open to continue.

Another way is to open application is from Terminal:

1. Open Terminal application.
2. Execute the following command to run Autoconfig app:

```bash
/Applications/Autoconfig\ API.app/Contents/MacOS/Autoconfig\ API; exit;
```

## Application is loaded, but I don't see any data

Autoconfig API is only available from withing Company network. Make sure you are connected with VPN or physically in the office.

## Where is my credentials are stored?

All configurations (including credentials) are stored locally in LocalStorage. So private data is not exposed to external servers anyhow.
