const rnpmlink = require('appcenter-link-scripts');

return rnpmlink.ios.checkIfAppDelegateExists()
    .then(() => rnpmlink.ios.initAppCenterConfig().catch((e) => {
        console.log(`Could not create or update AppCenter config file (AppCenter-Config.plist). Error Reason - ${e.message}`);
        return Promise.reject();
    }))
    .then(() => {
        const code = '  [AppCenterReactNativePush register];  // Initialize AppCenter push';
        return rnpmlink.ios.initInAppDelegate('#import <AppCenterReactNativePush/AppCenterReactNativePush.h>', code)
            .catch((e) => {
                console.log(`Could not initialize AppCenter push in AppDelegate. Error Reason - ${e.message}`);
                return Promise.reject();
            });
    })
    .then((file) => {
        console.log(`Added code to initialize iOS Push SDK in ${file}`);
        return rnpmlink.ios.addPodDeps(
            [
                { pod: 'AppCenter/Push', version: '1.3.0' },
                { pod: 'AppCenterReactNativeShared', version: '1.2.0' } // in case people don't link appcenter (core)
            ],
            { platform: 'ios', version: '9.0' }
        ).catch((e) => {
            console.log(`
            Could not install dependencies using CocoaPods.
            Please refer to the documentation to install dependencies manually.

            Error Reason - ${e.message}
        `);
            return Promise.reject();
        });
    })
    .catch(() => Promise.resolve());
