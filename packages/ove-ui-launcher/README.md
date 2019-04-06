# Launcher UI

This [React](https://reactjs.org/) web application provides a wizard that will guide you through launching an [OVE App](https://ove.readthedocs.io/en/stable/ove-apps/README.html) step-by-step.

It will also display the [curl](https://curl.haxx.se/docs/manpage.html) command that can be used to repeat this action at the commandline.

## Installation

The launcher UI can be launched either for development or in a production environment. 

In either case, fist install dependencies by running:

```sh
npm install
```

Unless [OVE Core](https://github.com/ove/ove) and the OVE Apps are running on localhost on their default ports, you will also need to modify the configuration file `.env` appropriately.

### Production mode

To launch in a production environment, first build the project:

```sh
npm run build
```

Then run it:

```sh
npm run start
```

You should then be able to access the UI by opening `http://localhost:8281` with a web browser.


### Development mode

Alternatively, to launch in development mode, simply run:

```sh
npm run start:dev
```

You should then be able to access the UI by opening `http://localhost:8281` with a web browser.


## Hosting content

Before using the launcher UI, you will need to host the content that you plan to load into the respective applications. [OVE](https://github.com/ove/ove) expects content to be accessible via URLs both locally and also in a distributed deployment. There are multiple options to host your content such that they are accessible via URLs.

1. Externally hosted static content: this is a straightforward option, but may expose your content to 3rd parties. Choices include cloud hosting providers such as [Amazon AWS](https://aws.amazon.com/getting-started/projects/host-static-website/) and [Google Cloud](https://cloud.google.com/storage/docs/hosting-static-website) or specialised cloud application platform providers such as [Heroku](https://www.heroku.com/) and [Netlify](https://www.netlify.com/).
2. [Locally hosted static content](#locally-hosted-static-content): this is a convenient choice for local testing and also does not expose your content to third parties. Choices include web servers such as [Apache HTTP Server](https://httpd.apache.org/), [NGinx](https://www.nginx.com/), and [Microsoft IIS](https://www.iis.net/), or simpler alternatives such as [Node.js HTTP Server](https://www.npmjs.com/package/http-server) or [Python Simple HTTP Server](https://docs.python.org/2/library/simplehttpserver.html).
3. Using an object storage: an object storage can be setup either locally or externally and can have open or restricted access. Choices include cloud storage services such as [Amazon S3](https://aws.amazon.com/what-is-cloud-object-storage/) and locally deployed alternatives (private cloud storage) such as [Minio](https://www.minio.io/).
4. [Using the OVE Asset Manager](#using-the-ove-asset-manager): this internally uses an object storage but is optimised for OVE projects and provides a much better user experience.

### Locally hosted static content

Once you have stored the desired content in a directory structure, all you need is to start a web-server. This can be done using one of the approaches shown below:

Node.js:

```sh
npm install http-server -g
http-server
```

Python 2:

```sh
python -m SimpleHTTPServer 9999
```

Python 3:

```sh
python3 -m http.server 9999
```

Please note that you may need to specify a port number if you have chosen to use Python and the default of port 8000 is already in use (the examples above specify 9999 as the port to use).

Once the server has started, the content will be available at the any of the URLs printed on the console, if you have chosen to use Node.js or at `http://localhost:8000` (or corresponding port number), if you have chosen to use Python.

### Using the [OVE Asset Manager](https://github.com/ove/ove-asset-manager)

The [OVE Asset Manager](https://github.com/ove/ove-asset-manager) is still work in progress.

## Using the Launcher UI

The launcher UI takes users through a step-by-step process to select, configure and deploy an application into an OVE space.

It is mostly self-explanatory, but there are a few things to note:

1. The launcher expects the chosen application to be running before you proceed to the second step. If it is not, the launcher will report a `selected application is not available` error.
1. The launcher can only be used to create sections that lie entirely within a space. If your chosen goemetry does not lie entirely within a space, you will be shown a form validation error.
1. The third step for configuring the application state for a section varies according to the chosen application. It is not displayed in the case of the [Controller App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-controller/README.html) and the [Replicator App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-replicator/README.html). It is displayed for the [Alignment App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-alignment/README.html) and the [Whiteboard App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-whiteboard/README.html), but a form is not available to the user. For the [Maps App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-maps/README.html) and the [WebRTC App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-webrtc/README.html), a choice of mode is not available and only pre-loaded named states can be selected. The complete form is available for all other apps providing options for selecting a pre-loaded named state or providing a URL for loading a new asset.
1. The fourth step for reviewing the state configuration and operation details provides the users with the opportunity to make changes to the JSON configuration that will be loaded when the application is launched. This option is available for all apps except for the [Alignment App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-alignment/README.html) and the [Whiteboard App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-whiteboard/README.html).
1. The fourth step also lets users decide whether all existing sections in a space must be deleted or retained before the new section is created when launching the chosen app.
1. For all apps except for the [Replicator App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-replicator/README.html) users can choose whether the application-specific controller is displayed on the browser. This choice is selected by default for the [Alignment](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-alignment/README.html), [Controller](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-controller/README.html), [Maps](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-maps/README.html), [SVG](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-svg/README.html), [WebRTC](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-webrtc/README.html) and [Whiteboard](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-whiteboard/README.html) apps.
1. The last two steps are displayed for all types of applications. The [curl](https://curl.haxx.se/docs/manpage.html) command to delete the existing sections on a space will only be available if the corresponding option was available and selected in the fourth step. The final step is merely a confirmation and the user is not expected to take further action unless if they wanted to launch another app, launch the application-specific controller or preview the space which should include the newly launched app.
