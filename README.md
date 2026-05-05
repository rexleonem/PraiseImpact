# Praise Impact 🕊️

Praise Impact is a comprehensive digital ecosystem for modern ministries, featuring a React Native mobile application, a Next.js web dashboard, and a robust Node.js backend.

## 🏗️ Project Architecture

This repository is managed as a **Yarn Workspace** monorepo:

- **`apps/mobile`**: Cross-platform mobile app built with Expo (React Native).
- **`apps/web`**: Admin dashboard and public web presence built with Next.js.
- **`services/api`**: RESTful API service providing data for both web and mobile platforms.

---

## 📱 Mobile App (`apps/mobile`)

The mobile app provides members with access to sermons, live streams, events, and community prayer requests.

### Key Features
- **Modern UI**: Dark-themed, glassmorphism design with Lucide icons.
- **Safe Area Aware**: Fully optimized for Android and iOS safe areas, ensuring the navigation bar sits perfectly above system controls.
- **Offline Support**: Caching system for sermons and events using AsyncStorage.
- **Push Notifications**: Integrated with Expo Notifications for live stream alerts.

### Getting Started
1. Install dependencies from the root: `yarn install`
2. Navigate to mobile: `cd apps/mobile`
3. Start the app: `npx expo start`

### Building for Production
We use **EAS Build** for production distributions.
- **Build Production APK**: `npx eas build -p android --profile production-apk`
- **Build Google Play Bundle (AAB)**: `npx eas build -p android --profile production`

---

## 💻 Web Dashboard (`apps/web`)

An administrative interface for managing church content and viewing analytics.

### Key Features
- **Admin Management**: Manage sermons, events, and prayer requests.
- **Analytics**: Visualization of engagement and attendance.
- **Responsive Design**: Optimized for desktop and tablet usage.

---

## ⚙️ Environment Configuration

The mobile app relies on the following environment variables (configured in `.env` and `eas.json`):

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | The base URL for the backend API. |
| `EXPO_PUBLIC_FIREBASE_*` | Firebase configuration for authentication and services. |

---

## 🛠️ Development Workflow

### Root Scripts
Run these from the project root:
- `yarn install`: Syncs all dependencies across the monorepo.
- `yarn dev:api`: Starts the backend service in development mode.
- `yarn dev:web`: Starts the Next.js development server.

### Troubleshooting
If you encounter dependency issues, ensure you are not mixing package managers. **Always use Yarn.**
To fix dependency inconsistencies:
1. Delete all `package-lock.json` files.
2. Run `yarn install` at the root.