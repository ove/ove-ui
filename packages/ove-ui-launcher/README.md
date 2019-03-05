# Launcher UI

This react web application can be used to launch applications on the OVE framework using wizard that will guide you step-by-step. It also produces equivalent [curl](https://curl.haxx.se/docs/manpage.html) commands for users who wish to use a CLI.

The launcher UI can be launched either for development or in a production environment. To launch in a production environment, simply run:

```sh
npm run start
```

To launch for development, run:

```sh
npm run start:dev
```

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

The launcher UI takes users through a step-by-step process to select, configure and deploy an application into an OVE space. Most of actions that must be taken are either self-explanatory or the users would be prompted to enter values that confirm to the corresponding specifications. There are however a few things to note when using this UI.

1. The launcher expects the chosen application to be running before you proceed to the second step. If it does not, it will report a `selected application is not available` error.
2. The launcher lists all spaces available within the pre-configured OVE environment. Not all instances of OVE may have the same spaces, and if you cannot find the space that you were expecting to select, please validate the configuration that you have used when installing the launcher.
3. The geometry that you provide will be validated to fit within the height and width of the chosen space.
4. The third step for configuring the application state for a section varies according to the chosen application. It is not displayed in the case of the [Controller App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-controller/README.html) and the [Replicator App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-replicator/README.html). It is displayed for the [Alignment App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-alignment/README.html) and the [Whiteboard App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-whiteboard/README.html), but a form is not available to the user. For the [Maps App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-maps/README.html) and the [WebRTC App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-webrtc/README.html), a choice of mode is not available and only pre-loaded named states can be selected. The complete form is available for all other apps providing options for selecting a pre-loaded named state or providing a URL for loading a new asset.
5. The fourth step for reviewing the state configuration and operation details provides the users with the opportunity to make changes to the JSON configuration that will be loaded when the application is launched. This option is available for all apps except for the [Alignment App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-alignment/README.html) and the [Whiteboard App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-whiteboard/README.html).
6. The fourth step also lets users decide whether all existing sections in a space must be deleted or retained before the new section is created when launching the chosen app.
7. For all apps except for the [Replicator App](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-replicator/README.html) users can choose whether the application-specific controller is displayed on the browser. This choice is selected by default for the [Alignment](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-alignment/README.html), [Controller](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-controller/README.html), [Maps](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-maps/README.html), [SVG](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-svg/README.html), [WebRTC](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-webrtc/README.html) and [Whiteboard](https://ove.readthedocs.io/en/stable/ove-apps/packages/ove-app-whiteboard/README.html) apps.
8. The last two steps are displayed for all types of applications. The [curl](https://curl.haxx.se/docs/manpage.html) command to delete the existing sections on a space will only be available if the corresponding option was available and selected in the fourth step. The final step is merely a confirmation and the user is not expected to take further action unless if they wanted to launch another app, launch the application-specific controller or preview the space which should include the newly launched app.