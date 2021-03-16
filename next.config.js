const withLessLoaders = require('@zeit/next-less');

module.exports = withLessLoaders({
    cssModules: false,
    lessLoaderOptions: {
        lessOptions: {
            javascriptEnabled: true
        }
    }
})
