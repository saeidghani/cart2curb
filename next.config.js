const withLessLoaders = require('@zeit/next-less');
const withScssLoaders = require('@zeit/next-sass');

module.exports = withLessLoaders({
    cssModules: false,
    lessLoaderOptions: {
        lessOptions: {
            javascriptEnabled: true
        }
    }
})
