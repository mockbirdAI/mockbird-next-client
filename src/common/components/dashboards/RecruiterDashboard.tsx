import React from 'react';

interface SessionProps {
  session: any;
}

const CandidateDashboard: React.FC<SessionProps> = ({ session }) => {
  return (
    <div className="h-screen">
        <h2>Recruiter Dashboard - welcome back {session?.user.firstName}</h2>
    </div>
  );
};

export default CandidateDashboard;