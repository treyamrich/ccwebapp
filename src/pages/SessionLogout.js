import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
} from 'react';

const SessionTimeout = ({signOut}) => {
  const [events, setEvents] = useState(['click', 'load', 'scroll']);

  let timeStamp;
  let warningInactiveInterval = useRef();
  let startTimerInterval = useRef();

  // start inactive check
  let timeChecker = () => {
    startTimerInterval.current = setTimeout(() => {
      let storedTimeStamp = sessionStorage.getItem('lastTimeStamp');
      warningInactive(storedTimeStamp);
    }, 60000);
  };

  // warning timer
  let warningInactive = (timeStamp) => {
    clearTimeout(startTimerInterval.current);
    warningInactiveInterval.current = setInterval(() => {
      const maxTime = 30;

      const diff = Math.abs(new Date() - new Date(timeStamp));
      const minPast = diff / (1000*60);

      if (minPast >= maxTime) {
        clearInterval(warningInactiveInterval.current);
        //setOpen(false);
        sessionStorage.removeItem('lastTimeStamp');
        signOut();
      }
    }, 1000);
  };

  // reset interval timer
  let resetTimer = useCallback(() => {
    clearTimeout(startTimerInterval.current);
    clearInterval(warningInactiveInterval.current);

    timeStamp = new Date();
    sessionStorage.setItem('lastTimeStamp', timeStamp); 

    timeChecker();
  }, []);


  useEffect(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    resetTimer();

    return () => {
      clearTimeout(startTimerInterval.current);
    };
  }, [resetTimer, events, timeChecker]);

  return <Fragment />;
};

export default SessionTimeout;