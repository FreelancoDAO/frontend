import React, { useRef, useEffect } from "react";
import { markRead } from "../../api/notification";

function NotificationCard({ notification, getNotifications }) {



  const handleMarkAsRead = async (id) => {
    await markRead(id);
    getNotifications();
    // const updatedNotifications = notifications.map((notification) => {
    //   if (notification._id === id) {
    //     return { ...notification, read: true };
    //   } else {
    //     return notification;
    //   }
    // });
    // setNotifications(updatedNotifications);
  };

  // const handleShowMessage = (id) => {
  //   const notification = notifications.find(
  //     (notification) => notification._id === id
  //   );
  //   if (notification) {
  //     // do something with the notification, such as displaying it in a modal
  //   }
  // };

  return (
    <div className={` z-100 bg-gray-700 rounded-lg p-4 mb-2 transition-all duration-300 ${notification.read ? "opacity-50" : "opacity-100 hover:bg-gray-600"} w-76 max-w-sm`}>
      <div className="text-gray-300 text-sm mb-2 break-all overflow-hidden overflow-ellipsis whitespace-normal" style={{ overflowWrap: 'break-word' }}>{notification.message}</div>
      <div className="flex justify-end">
        {!notification.read && (
          <button
            className="text-gray-500 text-sm mr-2 hover:text-white"
            onClick={() => handleMarkAsRead(notification._id)}
          >
            Mark as Read
          </button>
        )}
        {/* <button
          className="text-gray-500 text-sm hover:text-white"
        // onClick={() => onShowMessage(notification)}
        >
          Show Message
        </button> */}
      </div>
    </div>
  );
}
// Here, I've added the overflow-hidden and overflow-ellipsis classes to truncate the text if it overflows. I've also added the style attribute to apply the overflow - wrap property to break the word and wrap the text.




function NotificationList({ notifications, toggleNotifications, getNotifications }) {
  const componentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        toggleNotifications(); // Call the onClose function when a click occurs outside the component
      }
    };

    // Add event listener to detect clicks outside the component
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleNotifications]);
  return (
    <div ref={componentRef} className="fixed right-0 top-16 bottom-16 z-50 w-76 overflow-auto ">
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg backdrop-filter backdrop-blur-md">
        <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-800 p-4">
          <h3 className="text-lg font-bold text-gray-300">Notifications</h3>
          <button className="text-gray-300 hover:text-white" onClick={toggleNotifications}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M18.3 5.71A9 9 0 1 0 19 12h-2a7 7 0 1 1-.71-6.25l2-2zM12 4a8.06 8.06 0 0 0-5.66 2.34l-1.41-1.41A10 10 0 1 1 12 22a9.91 9.91 0 0 1-6.36-2.29L4 19.59A7 7 0 1 0 12 5.83V7a5 5 0 1 1 0 10v2a7 7 0 0 0 0-14z" />
            </svg>
          </button>
        </div>
        {notifications.length === 0 ? (
          <div className="text-gray-300 text-sm w-100">No new notifications.</div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                getNotifications={getNotifications}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default NotificationList;

