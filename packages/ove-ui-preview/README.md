# Preview UI

This [React](https://reactjs.org/) web application can be used to preview an [OVE](https://github.com/ove/ove Space. It also allows users to download corresponding commands and configurations that can be used to recreate the same space using tools such as [curl](https://curl.haxx.se/docs/manpage.html) or SDKs such as the [Python SDK](https://github.com/ove/ove-sdks/tree/master/python).


## Installation

The preview UI can be launched either for development or in a production environment. 

In either case, fist install dependencies by running:

```sh
npm install
```

If you want to use the Preview UI from a machine other than the one running [OVE Core](https://github.com/ove/ove), you will also need to modify the configuration file `.env` and set `REACT_APP_OVE_HOST` appropriately.

## Production mode

To launch in a production environment, first build the project:

```sh
npm run build
```

Then run it:

```sh
npm run start
```

You should then be able to access the UI by opening `http://localhost:8080?oveSpace=<SPACE_NAME>` with a web browser (replacing `<SPACE_NAME>` with the name of the space that you wish to view).

## Development mode

Alternatively, to launch in development mode, simply run:

```sh
npm run start:dev
```

You should then be able to access the UI by opening `http://localhost:8282?oveSpace=<SPACE_NAME>` with a web browser (replacing `<SPACE_NAME>` with the name of the space that you wish to view).
