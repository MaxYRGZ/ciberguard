
# CiberGuard - Password Manager and Security Advisor

## Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/MaxYRGZ/ciberguard.git
   cd ciberguard
   ```
2.Install project dependencies:
```shellscript
npm install
 ```
Install required dependencies for the project:
```shellscript
npm install @react-navigation/native @react-navigation/stack
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-native-clipboard/clipboard
npm install react-native-sqlite-storage
npm install react-native-biometrics
 ```
For Android specific dependencies:
```shellscript
npm install @react-native-community/async-storage
 ```
## Running the App

1. Start Metro bundler:

```shellscript
npx react-native start
```


2. Run on Android:

```shellscript
nmp start
a
```




## Building Release APK

1. Navigate to Android directory:

```shellscript
cd android
```


2. Clean the project:

```shellscript
./gradlew clean
```


3. Build release APK:

```shellscript
./gradlew assembleRelease
```




The generated APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

## Important Note

Before running the app, make sure to:

1. Configure your OpenAI API key in `app/screens/Help.tsx`
2. Set up your Android SDK path in `android/local.properties`:
   ```plaintext
   sdk.dir=/path/to/your/Android/sdk
   ### Obtaining an OpenAI API Key

To use the ChatGPT integration in the app, you need to obtain an API key from OpenAI. Follow these steps:

1. Go to the [OpenAI website](https://openai.com/) and sign up for an account if you haven't already.
2. Once logged in, navigate to the [API keys page](https://platform.openai.com/account/api-keys) in your account dashboard.
3. Click on "Create new secret key" to generate a new API key.
4. Copy the generated key immediately, as you won't be able to see it again.
5. Paste the API key into the `app/screens/Help.tsx` file, replacing the placeholder:

```javascript
const CHATGPT_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
```




**Note:** Keep your API key confidential and never share it publicly or commit it to version control systems. Consider using environment variables or a secure key management system for production use.

For more information on using the OpenAI API, refer to the [OpenAI API documentation](https://platform.openai.com/docs/introduction).

```plaintext


This addition provides clear steps for obtaining the OpenAI API key, including relevant links to the OpenAI website and API documentation. It also emphasizes the importance of keeping the API key secure.
```


## Troubleshooting

If you encounter any issues:

1. Clear React Native cache:

```shellscript
npx react-native start --reset-cache
```


2. Rebuild the app:

```shellscript
npx react-native rebuild
```


3. For Android gradle issues:

```shellscript
cd android
./gradlew clean
cd ..
npx react-native run-android
```
