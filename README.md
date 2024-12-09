# CiberGuard - Password Manager and Security Advisor

## Repository Overview

This repository contains the source code for **CiberGuard**, a mobile application developed in React Native that serves as a password manager and security advisor. The application is designed to help users securely manage their passwords and receive personalized security advice.

## Purpose within the Global Project

CiberGuard is part of a larger project focused on improving users' digital security. Its primary objectives are:

1. Provide an easy-to-use tool for generating and storing secure passwords.
2. Educate users on best practices for online security.
3. Offer personalized security advice through ChatGPT integration.
4. Reduce security risks caused by poor password management practices.

This repository is essential for the development and maintenance of the CiberGuard application, enabling developers to collaborate, track changes, and manage the source code efficiently.

## Features

- User authentication (login and registration)
- Password generation with customizable options
- Secure password storage
- Display of security tips
- Integration with ChatGPT to answer security-related questions
- Viewing and managing AI responses

## Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/MaxYRGZ/ciberguard.git
   cd ciberguard
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Install required dependencies for the project:
   ```bash
   npm install @react-navigation/native @react-navigation/stack
   npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
   npm install @react-native-clipboard/clipboard
   npm install react-native-sqlite-storage
   npm install react-native-biometrics
   ```

4. For Android-specific dependencies:
   ```bash
   npm install @react-native-community/async-storage
   ```

## Running the App

1. Start the Metro bundler:
   ```bash
   npx react-native start
   ```

2. Run the app on Android:
   ```bash
   npx react-native run-android
   ```

## Building a Release APK

1. Navigate to the Android directory:
   ```bash
   cd android
   ```

2. Clean the project:
   ```bash
   ./gradlew clean
   ```

3. Build the release APK:
   ```bash
   ./gradlew assembleRelease
   ```

The generated APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

## Important Note

Before running the app, ensure the following:

1. Configure your OpenAI API key in `app/screens/Help.tsx`.
2. Set up your Android SDK path in `android/local.properties`:
   ```plaintext
   sdk.dir=/path/to/your/Android/sdk
   ```

### Obtaining an OpenAI API Key

To use the ChatGPT integration in the app, follow these steps to obtain an API key:

1. Visit the [OpenAI website](https://openai.com/) and create an account if you don’t have one.
2. After logging in, navigate to the [API keys page](https://platform.openai.com/account/api-keys) in your account dashboard.
3. Click on "Create new secret key" to generate an API key.
4. Copy the key immediately, as it won’t be visible again.
5. Paste the API key into the `app/screens/Help.tsx` file, replacing the placeholder:
   ```javascript
   const CHATGPT_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
   ```

**Note:** Keep your API key private and never share it publicly or commit it to version control systems. For production use, consider environment variables or a secure key management system.

For more information on using the OpenAI API, refer to the [OpenAI API documentation](https://platform.openai.com/docs/introduction).

## Troubleshooting

If you encounter any issues:

1. Clear the React Native cache:
   ```bash
   npx react-native start --reset-cache
   ```

2. Rebuild the app:
   ```bash
   npx react-native rebuild
   ```

3. For Android Gradle issues:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```
