import { init } from '@rematch/core';
import immerPlugin from "@rematch/immer";
import persistPlugin from "@rematch/persist";
import loadingPlugin from '@rematch/loading';
import storage from 'redux-persist/lib/storage'

import * as models from './models';

const persistConfig = {
    key: 'initial',
    storage,
}

const store = init({
    models,
    plugins: [
        immerPlugin(),
        persistPlugin(persistConfig),
        loadingPlugin()
    ]
})

export const getStore = () => store;

export default store;