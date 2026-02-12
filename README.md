
HOSTED ON VERCEL AT: https://pantryinventory-app.vercel.app

Project Title
Inventory Management System

Project Description

This project is a web-based Inventory Management System built with Next.js, Firebase, and Material-UI. It allows users to manage their 
inventory by adding, removing, and searching for items. The project also supports capturing images via webcam or uploading images from 
the device to associate with inventory items.

Features

Real-Time Inventory Management: Seamless integration with Firebase Firestore for real-time updates of inventory items.
Image Capture and Upload: Users can capture item images via webcam or upload images from their device, which are stored in Firebase Storage.
Responsive Design: The UI is built using Material-UI, ensuring a responsive and user-friendly experience across all devices.
Search Functionality: Users can search for items in the inventory using a dynamic search bar.
Async Data Handling: Efficient handling of asynchronous operations, ensuring smooth uploads and data updates without affecting the user experience.

Technologies Used

Frontend: Next.js, React, Material-UI
Backend: Firebase Firestore for database management
Storage: Firebase Storage for storing item images
Camera Integration: Webcam capture using the react-webcam library

Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase configuration:
   - Copy `.env.local.example` to `.env.local`
   - Add your Firebase credentials to `.env.local`
   - You can get these credentials from your Firebase project settings
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

Contributions are welcome!


