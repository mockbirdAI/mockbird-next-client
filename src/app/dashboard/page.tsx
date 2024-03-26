import CandidateDashboard from "@/common/components/dashboards/CandidateDashboard";
import RecruiterDashboard from "@/common/components/dashboards/RecruiterDashboard";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="h-screen">
        {
          session?.user.role == UserRole.RECRUITER ? (
            <RecruiterDashboard session={session} />
          ) : (
            <CandidateDashboard session={session} />
          )
        
        }
      </div>

    )
  }

  return (
    <div className="h-screen">
      <h2>Please login to see this admin page.</h2>
    </div>
    
  );
}

export default page;