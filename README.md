# Overview

Liftoff - by [**Attila Technologies**](https://www.attila-technologies.com/)
<br>This is an app available in the marketplace of [monday.com](https://try.monday.com/d8x1zdvc4fg5).
<br>It contains recipes that can be used to enhanced your monday boards.

## Monday Features

1. Dates

2. Duplicates

3. Ids

4. Names

5. Utilities

6. _Formulas_ (Coming soon ...)

# Developper Mode

1. Make sure you have [Node](https://nodejs.org/en) (v16.16+), npm/[yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) and [ngrok](https://ngrok.com/) installed
2. Install dependencies with npm:

```
$ npm install
```

3. Install dependencies with yarn:

```
$ yarn install
```

## Run the project

1. Add your MONDAY_SIGNING_SECRET to .env file
   <br> \*\* To get your MONDAY_SIGNING_SECRET go to monday.com, open Developers section, open your app and find the Signing Secret in "Basic Information" section
2. Add PORT=8080 to env. file
3. Run the server with ngrok tunnel with the command:

```
ngrok http --domain=probable-pelican-infinitely.ngrok-free.app 8080
```

4. Finally, run :

```
$ npm start
```
