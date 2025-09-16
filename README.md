### RLMS - R Learning Management System

RLMS is a simple, modern, and interactive Learning Management System built with React and Firebase. It provides basic functionalities for an administrator to manage course content and for students to track their progress.

### Features

  * **User Authentication**: Secure sign-in for users and an admin.
  * **Admin Panel**: A dedicated section for administrators to create, edit, and delete courses, modules, and materials.
  * **Course Management**: Create courses with titles and descriptions.
  * **Module Management**: Organize courses into modules for structured learning.
  * **Materials Management**: Add different types of learning materials to modules, including:
      * **Text/HTML**: Content rendered directly on the page.
      * **Video**: Supports direct video links, YouTube, and Vimeo embeds.
      * **PDF**: Embeds a PDF viewer for drive links.
      * **Web Link**: A button to open an external link in a new tab.
  * **Progress Tracking**: Users can mark materials as complete, and their progress is reflected on the dashboard.
  * **Responsive UI**: A fluid user interface with animated components and a mobile-friendly sidebar.

### Technologies Used

  * **Frontend**: React, TypeScript, Vite
  * **State Management**: Zustand
  * **Backend**: Firebase (Authentication, Firestore Database)
  * **Styling**: Tailwind CSS, DaisyUI
  * **Icons**: Lucid Icons

### Getting Started (Local Development)

Follow these steps to get a local copy of the project up and running.

#### Prerequisites

  * Node.js (LTS version recommended)
  * npm (comes with Node.js)
  * Firebase account

#### Installation

1.  Clone the repository:
    ```bash
    git clone [your-repo-url]
    cd rlms
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

#### Firebase Setup

1.  Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  Add a new web app and copy your Firebase configuration.
3.  Create a file named `firebase.ts` in the `src/` directory and add your configuration:
    ```typescript
    // src/firebase.ts
    import { initializeApp } from 'firebase/app';
    import { getAuth } from 'firebase/auth';
    import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    ```
4.  Enable **Firestore Database** and **Firebase Authentication** in the Firebase Console.
5.  Set up an admin user by adding a user in the Firebase Authentication tab with the email `admin@rlms.com`.

#### Running the Project

To start the development server, run:

```bash
npm run dev
```

### Building for Production

To create a production build of the application, run the build script:

```bash
npm run build
```

This will create a `dist` folder with your production-ready files.

### Deployment to Firebase Hosting

1.  If you haven't already, install the Firebase CLI:
    ```bash
    npm install -g firebase-tools
    ```
2.  From your project root, initialize Firebase Hosting:
    ```bash
    firebase init
    ```
      * Select **Hosting**.
      * Choose your Firebase project.
      * Set the public directory to **`dist`**.
      * Configure as a single-page app by selecting **`Y`**.
3.  Deploy the project:
    ```bash
    npm run build
    firebase deploy --only hosting
    ```
    Your application will be live at the hosting URL provided by the CLI.