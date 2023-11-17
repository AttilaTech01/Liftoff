## Overview

This is the "Quickstart Integration" example Monday app.
<br>It can be used as a board recipe, which transforms data from one text column to another

<br>This app demonstrates how to use:

- integration recipe
- custom action
- call authentication with JWT
- query monday API using short lived token (seamless authentication)
- remote options for custom fields

<br>You can find more info in our QuickStart guide [here](https://monday.com/developers/apps/quickstart-integration/)
<br>![Screenshot](https://dapulse-res.cloudinary.com/image/upload/v1658942490/remote_mondaycom_static/developers/screenshots/QUICKSTART_GIPHY.gif)

## Install

1. Make sure you have Node (v16.16+) and yarn installed

<br>
3. Install dependencies with yarn:

```
$ yarn install
```

## Run the project

1. Add your MONDAY_SIGNING_SECRET to .env file
   <br> \*\* To get your MONDAY_SIGNING_SECRET go to monday.com, open Developers section, open your app and find the Signing Secret in "Basic Information" section
2. Add PORT=6060 to env. file
3. Run the server with ngrok tunnel with the command: ngrok http --domain=probable-pelican-infinitely.ngrok-free.app 6060

```
$ npm start
```
