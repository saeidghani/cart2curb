const withLessLoaders = require('@zeit/next-less');
const withScssLoaders = require('@zeit/next-sass');

module.exports = withScssLoaders(
    withLessLoaders({
        cssModules: false,
        lessLoaderOptions: {
            lessOptions: {
                javascriptEnabled: true
            }
        }
    })
);
