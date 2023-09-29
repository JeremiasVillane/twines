import { SignedIn, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";
import { LogOutIcon } from "lucide-react";

function Topbar() {
  return (
    <nav className="topbar select-none">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Twines</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer" title="Salir">
              <LogOutIcon color="white" />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar;
