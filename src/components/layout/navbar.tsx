// import React from "react";
// import Link from "next/link";
// import { auth } from "@/lib/auth";
// import SignOutButton from "./auth/signout-button";
// import { headers } from "next/headers";

// export default async function Navbar() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   return (
//     <nav className="py-2 px-10 flex justify-between items-center  shadow-xl">
//       <h1 className="text-xl font-bold">Logo</h1>
//       <ul className="flex gap-4 space-x-7">
//         <li>
//           <Link href="/">Home</Link>
//         </li>
//         <li>
//           <Link href="/admin/dashboard">Dashboard</Link>
//         </li>
//         <li>
//           <Link href="/admin/profile">Profile</Link>
//         </li>
//       </ul>
//       {session ? (
//         <div>
//           <SignOutButton />
//         </div>
//       ) : (
//         <>
//           <div className="flex gap-6 py-4">
//             <Link href="/auth/login" className="underline">
//               Login
//             </Link>
//             <Link href="/auth/register" className="underline">
//               Register
//             </Link>
//           </div>
//         </>
//       )}
//     </nav>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeModeToggle } from "../ui/theme-toggle";
import { useSession } from "@/lib/auth-client";
import SignOutButton from "../auth/signout-button";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
];

export default function Navbar() {
  const [menuState, setMenuState] = useState(false);
  const session = useSession();
  console.log("Client", session);
  return (
    <>
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed  w-full z-50 border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <span className="size-10 bg-red-500 rounded-full"></span>
                </Link>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  <ThemeModeToggle />
                  {session.data?.session ? (
                    <div>
                      <SignOutButton />
                    </div>
                  ) : (
                    <>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/auth/login">
                          <span>Login</span>
                        </Link>
                      </Button>

                      <Button asChild size="sm">
                        <Link href="/auth/register">
                          <span>Login</span>
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
