import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/common/components/MaxWidthWrapper";
import { buttonVariants } from "@/common/components/ui/Button";
import { MobileNav } from "@/common/components/MobileNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import ClickableAvatar from "./ClickableAvatar";
import { UserRole } from "@prisma/client";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const isUserSignedIn = session?.user ? true : false;
  const isRecruiter = session?.user?.role === "recruiter" ? true : false;
  
  return (
    <nav
      className={cn(
        "sticky h-15 inset-x-0 top-0 z-30 bg-white-400 text-black bg-white border-b backdrop-blur-lg transition-all"
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link
            href={isUserSignedIn ? "/dashboard" : "/"}
            className="flex z-40 justify-center items-center gap-1"
          >
            <Image
              src="/mockbird_temp_logo.svg"
              alt="mockbird logo"
              width={50}
              height={50}
              quality={100}
              className="w-7 h-7"
            />
            <span className="text-xl font-semibold">Mockbird</span>
          </Link>
          
          <div className="flex gap-1 sm:gap-4 items-center mx-auto">
            {/* {!isUserSignedIn ? (
              <MobileNav />
            ) : (
              <div>
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "text-black border-gray-400 sm:hidden mr-3",
                  })}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </div>
            )} */}

            <div className="hidden items-center space-x-4 sm:flex">
              {!isUserSignedIn ? (
                <>
                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-black py-2 px-4 w-full"
                    })}
                    href="https://www.linkedin.com/company/mockbird/about/"
                    target="_blank"
                  >
                    About
                  </Link>
                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-black py-2 px-4 w-full"
                    })}
                    href="/discover"
                  >
                    Explore
                  </Link>
          
                  <div className="relative group">
                    <Link
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className: "text-black flex items-center"
                      })}
                      href="#"
                    >
                      Recruiters
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </Link>
                    <div className="absolute left-0 mt-0 group-hover:block hidden bg-white shadow-lg rounded-md">
                      <Link
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                          className: "text-black py-2 px-4 w-full",
                        })}
                        href="https://forms.gle/duFKw7MEejDCCKnE6"
                        target="_blank"
                      >
                        Join as a Recruiter
                      </Link>
                    </div>
                  </div>

                  <div className="relative group">
                    <Link
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className: "text-black flex items-center"
                      })}
                      href="#"
                    >
                      Resources
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </Link>
                    <div className="absolute left-0 mt-0 group-hover:block hidden bg-white shadow-lg rounded-md">
                      <Link
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                          className: "text-black py-2 px-4 w-full"
                        })}
                        target="_blank"
                        href="https://www.linkedin.com/company/mockbird/"
                      >
                        Blogs
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {session?.user.role === UserRole.CANDIDATE && (
                    <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-black py-2 px-4"
                    })}
                    href="/discover"
                  >
                    Discover
                  </Link>
                  )}
                  {session?.user.role === UserRole.RECRUITER && <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-black border-gray-400"
                    })}
                    href="/availability"
                  >
                    Availability
                  </Link>}
                  {session?.user.role === UserRole.RECRUITER && <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-black border-gray-400"
                    })}
                    href="/balance"
                  >
                    Balance
                  </Link>}
                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-black border-gray-400"
                    })}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-black border-gray-400"
                    })}
                    href="/support-ticket"
                  >
                    Support
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-1 sm:gap-4 items-center">
            {!isUserSignedIn ? (
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "text-black"
                  })}
                  href="/sign-in"
                >
                  Log In
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "bg-sxpurple text-white hover:bg-sxpurple/80"
                  })}
                  href="/sign-up"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <SignOutButton />
                <ClickableAvatar imageUrl={""} altText={""} />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
