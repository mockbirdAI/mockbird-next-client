import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/common/components/ui/Sheet";
import { SideNav } from "@/common/components/SideNav";

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="sm:hidden pr-4">
        <Menu />
      </SheetTrigger>

      <SheetContent side="right" className="p-0 bg-secondary pt-5 w-32">
        <SheetClose />
        <SideNav />
      </SheetContent>
    </Sheet>
  );
};
