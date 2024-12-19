
import 'dotenv/config';

export default {
  expo: {
    name: "Densiflow",
    slug: "Densiflow",
    version: "1.0.0",
    scheme: "densiflow",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#007AFF"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#007AFF"
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      package: "com.baos.Densiflow",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_API_KEY 
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "react-native-fbsdk-next",
        {
          appID: process.env.APP_ID ,
          clientToken: process.env.CLIENT_TOKEN,
          displayName: "SIGN UP IF YOU HAVENT SIGN UP",
          scheme: process.env.SCHEME,
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
          iosUserTrackingPermission: "This identifier will be used to deliver personalized ads to you."
        }
      ],
      ["@react-native-google-signin/google-signin"],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Densiflow to use your location."
        }
      ],
      // [
      //   "expo-build-properties",
      //   {
      //     "ios": {
      //       "useFrameworks": "static"
      //     }
      //   }
      // ],
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": process.env.ANDROID_APP_ID,
          // "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
        }
      ]
    ],
    extra: {
      eas: {
        projectId: process.env.PROJECT_ID 
      }
    },
    updates: {
      url: "https://u.expo.dev/67aff93e-33f4-48c3-9f07-958375977b40",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  }
};
