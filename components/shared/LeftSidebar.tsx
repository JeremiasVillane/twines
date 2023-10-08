"use client";

import { sidebarLinks } from "@/constants";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <main className="custom-scrollbar leftsidebar select-none">
      <section
        id="main-buttons"
        className="flex w-full flex-1 flex-col gap-6 px-6"
      >
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile") link.route = `${link.route}/${userId}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <div
                title={link.label}
                className="flex items-center justify-center gap-3"
              >
                {link.icon}

                <p className="text-light-1 max-lg:hidden max">{link.label}</p>
              </div>
            </Link>
          );
        })}
      </section>

      <section id="logout-button" className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4" title="Salir">
              <LogOutIcon color="white" />
              <p className="text-light-2 max-lg:hidden">Salir</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </section>
    </main>
  );
}

export default LeftSidebar;
