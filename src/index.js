import React from 'react';
import RootSiblings from 'react-native-root-siblings';
import GeneralPicker from './GeneralPicker';
import CityData from './CityData';
import * as CityProvider from './CityProvider';

let instance = null;

function showPicker(ViewClass, config) {
    if (instance) {
        return;
    }
    instance = new RootSiblings(
        <ViewClass
            {...config}
            onFinish={(selectedItems) => {
                instance && instance.destroy(() => {
                    instance = null;
                    setTimeout(() => {
                        config.onFinish && config.onFinish(selectedItems);
                    }, 0);
                });
            }}
            onDismiss={() => {
                instance && instance.destroy(() => {
                    instance = null;
                    setTimeout(() => {
                        config.onDismiss && config.onDismiss();
                    }, 0);
                });
            }}
        />
    );
}

export default {
    showGeneralPicker: (config) => showPicker(GeneralPicker, config),
};

export {
    GeneralPicker,
    CityData,
    CityProvider,
};