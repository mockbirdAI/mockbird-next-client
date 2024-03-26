import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="h-screen">
        <h2>Admin page - welcome back {session?.user.firstName}</h2>
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