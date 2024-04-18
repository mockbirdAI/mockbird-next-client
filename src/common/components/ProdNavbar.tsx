import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

import MaxWidthWrapper from "@/common/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/common/components/ui/Button";
import { MobileNav } from "@/common/components/MobileNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import ClickableAvatar from "./ClickableAvatar";
import { UserRole } from "@prisma/client";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const isUserSignedIn = session?.user ? true : false;
  const isRecruiter = session?.user?.role === "recruiter" ? true : false;

  return (
    <nav
      className={cn(
        "sticky h-14 inset-x-0 top-0 z-30 bg-white-400 text-black border-b border-gray-700 backdrop-blur-lg transition-all"
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link
            href={isUserSignedIn ? "/dashboard" : "/"}
            className="flex z-40 justify-center items-center gap-1"
          >
            <Image
              src="/mockbirdtrans.png"
              alt="mockbird logo"
              width={50}
              height={50}
              quality={100}
              className="w-7 h-7"
            />
            <span className="text-2xl font-semibold">Mockbird</span>
          </Link>
          <div className="flex gap-1 sm:gap-4 items-center">
            <div className="hidden items-center space-x-4 sm:flex">
                <>
                  <Link
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "bg-sxpurple text-white hover:bg-sxpurple/80"
                    })}
                    href="https://forms.gle/n9siDSWyFAxVmAh98"
                    target="_blank"
                  >
                    Sign Up
                  </Link>
                </>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
