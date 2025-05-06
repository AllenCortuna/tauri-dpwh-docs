// import { enable, isEnabled} from '@tauri-apps/plugin-autostart';
// import { useEffect } from "react";
// Enable autostart
  // useEffect(() => {
  //   (async () => {
  //     const autoStartEnabled = await isEnabled();
  //     if (!autoStartEnabled) {
  //       await enable();
  //       console.log(`registered for autostart? ${await isEnabled()}`);
  //     }
  //   })();
  // }, []);


// import { useEffect } from 'react';
// import { 
//   isPermissionGranted, 
//   requestPermission, 
//   sendNotification 
// } from '@tauri-apps/plugin-notification';


 // useEffect(() => {
  //   const setupNotifications = async () => {
  //     // Request permission for notifications
  //     let permissionGranted = await isPermissionGranted();
  //     if (!permissionGranted) {
  //       const permission = await requestPermission();
  //       permissionGranted = permission === 'granted';
  //     }

  //     if (permissionGranted) {
  //       // Function to check time and send notification
  //       const checkTimeAndNotify = () => {
  //         const now = new Date();
  //         const hours = now.getHours();
  //         const minutes = now.getMinutes();
  //         console.log('now.get', now.getDate())

  //         // Check if it's 8:30 AM
  //         if (hours === 8 && minutes === 30) {
  //           sendNotification({
  //             title: 'Bidding Reminder',
  //             body: 'Good morning! Time to check your Procurement schedule.'
  //           });
  //         }
          
  //         // Check if it's 2:00 PM
  //         if (hours === 13 && minutes === 0) {
  //           sendNotification({
  //             title: 'Pre-Bid Reminder',
  //             body: 'Good afternoon! Time to review your afternoon tasks.'
  //           });
  //         }
  //       };

  //       // Run the check every minute
  //       const intervalId = setInterval(checkTimeAndNotify, 10000);

  //       // Cleanup interval on component unmount
  //       return () => clearInterval(intervalId);
  //     }
  //   };

  //   setupNotifications();
  // }, []);