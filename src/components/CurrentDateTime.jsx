// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

const CurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format hours and minutes
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      // Get the day name
      const dayName = now.toLocaleDateString("en-US", { weekday: "long" });

      // Format day, month, and year
      const day = now.getDate();
      const month = now.toLocaleDateString("en-US", { month: "short" });
      const year = now.getFullYear().toString().slice(-2);

      // Combine into the desired format
      const formattedTime = `${hours}:${minutes} - ${dayName}, ${day} ${month} ${year}`;

      setCurrentTime(formattedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);
  return<div>{currentTime}</div> ;
};

export default CurrentDateTime;
