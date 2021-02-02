const withLess = require('@zeit/next-less')
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withPlugins = require('next-compose-plugins')

const nextConfig = {}

const plugins = [
    withCSS,
    withLess({
        lessLoaderOptions: {
            javascriptEnabled: true,
        },
        webpack: (config, {isServer}) => {
            if (isServer) {
                const antStyles = /antd\/.*?\/style.*?/;
                const origExternals = [...config.externals];
                config.externals = [
                    (context, request, callback) => {
                        if (request.match(antStyles)) return callback();
                        if (typeof origExternals[0] === 'function') {
                            origExternals[0](context, request, callback);
                        } else {
                            callback();
                        }
                    },
                    ...(typeof origExternals[0] === 'function' ? [] : origExternals),
                ];
                config.module.rules.unshift({
                    test: antStyles,
                    use: 'null-loader',
                });
            }
            return config
        },
    }),
    withSass
]

module.exports = withPlugins(plugins, nextConfig)
