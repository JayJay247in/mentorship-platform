// client/src/hooks/useCalendar.ts

import { createEvent, EventAttributes } from 'ics';

import { Session } from '../types'; // Import your Session type

/**
 * A custom hook to provide calendar event generation functionality.
 */
export const useCalendar = () => {

  /**
   * Generates and triggers the download of an .ics file for a session.
   * @param session - The session object containing scheduling details.
   */
  const generateCalendarInvite = (session: Session) => {
    // 1. Destructure necessary information from the session object.
    const { mentor, mentee, scheduledTime } = session;

    // 2. The 'ics' library expects dates in a specific array format.
    // We parse the ISO string from the database into a Date object.
    const eventDate = new Date(scheduledTime);

    // 3. Define the event attributes according to the 'ics' library's API.
    const event: EventAttributes = {
      // The title of the calendar event.
      title: `Mentorship Session: ${mentor.name} & ${mentee.name}`,

      // A more detailed description for the event body.
      description: `A one-on-one mentorship session. Please be prepared and on time.`,

      // The location can be a physical address or a video call link.
      // We'll use a placeholder for now, but this could be dynamic in the future.
      location: 'Online - Video Call',

      // Start time [Year, Month, Day, Hour, Minute]
      start: [
        eventDate.getFullYear(),
        eventDate.getMonth() + 1, // Month is 1-indexed
        eventDate.getDate(),
        eventDate.getHours(),
        eventDate.getMinutes(),
      ],

      // We'll assume a 1-hour duration for the session.
      duration: { hours: 1, minutes: 0 },

      // List of attendees.
      attendees: [
        { name: mentor.name, rsvp: true },
        { name: mentee.name, rsvp: true },
      ],
    };

    // 4. Use the library to create the event string.
    // The createEvent function returns either an error or the .ics file content as a string.
    const { error, value } = createEvent(event);

    if (error) {
      console.error("Failed to create calendar event:", error);
      // You could add a toast notification here for the user.
      return;
    }

    if (value) {
      // 5. To trigger a download, we create a temporary invisible link element.
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      // Set the name of the downloaded file.
      link.setAttribute('download', 'mentorship-session.ics');
      
      // Append the link to the body, click it, and then remove it.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the created URL.
      URL.revokeObjectURL(url);
    }
  };

  // Return the function so components can use it.
  return { generateCalendarInvite };
};