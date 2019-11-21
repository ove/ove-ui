# Launcher UI

This [React](https://reactjs.org/) web application provides an interactive form that enables you to configure and launch an [OVE App](https://ove.readthedocs.io/en/stable/ove-apps/README.html).

It will also display the [curl](https://curl.haxx.se/docs/manpage.html) command(s) that can be used to repeat this action at the command line.

The launcher UI can be accessed by opening the URL `http://OVE_CORE_HOST:PORT/ui/launcher` with a web browser. 

Before using the launcher UI, you will need to host the content that you plan to load into the respective applications: for more information on hosting content for OVE, see the [Usage](https://ove.readthedocs.io/en/stable/docs/USAGE.html) page.

The list of available spaces is fetched from the OVE instance specified by the `REACT_APP_OVE_HOST` environment variable; if a space that you expect to see is not listed, check that this is set correctly.
