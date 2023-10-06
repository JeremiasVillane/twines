import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[40px] w-[40px]",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar;
