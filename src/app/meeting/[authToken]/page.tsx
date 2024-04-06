'use client';

import { useEffect } from 'react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';

function Page({ params }: { params: { authToken: string } }) {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const authToken = params.authToken;

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    initMeeting({
      authToken,
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <div className='h-screen'>
      <DyteMeeting meeting={meeting!} />
    </div>
    
  );
}

export default Page;