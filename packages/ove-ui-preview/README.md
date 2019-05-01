# Preview UI

This [React](https://reactjs.org/) web application can be used to preview an [OVE](https://github.com/ove/ove) Space. It also allows users to download corresponding commands and configurations that can be used to recreate the same space using tools such as [curl](https://curl.haxx.se/docs/manpage.html) or SDKs such as the [Python Client Library](https://ove.readthedocs.io/en/stable/ove-sdks/python/README.html).

The preview UI can be accessed by opening the URL `http://OVE_CORE_HOST:PORT/ui/preview?oveSpace=<SPACE_NAME>` with a web browser (replacing `<SPACE_NAME>` with the name of the space that you wish to view).
