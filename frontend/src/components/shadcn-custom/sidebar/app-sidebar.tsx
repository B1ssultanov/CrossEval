"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { getCurrentUser } from "@/store/slices/userSlice";
import { House, CalendarCheck, BookA } from "lucide-react";
import { NavMain } from "@/components/shadcn-custom/sidebar/nav-main";
import { NavUser } from "@/components/shadcn-custom/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();

  const { name, surname, email, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const userName = name || surname ? `${name} ${surname}` : "Loading...";

  const data = {
    user: {
      name: userName,
      email: email || "no email",
      avatar: "/assets/images/decoration/happy-woman-vector.png",
    },
    navMain: [
      { title: "Home page", url: "/", icon: House },
      { title: "Schedule", url: "/schedule", icon: CalendarCheck },
      // { title: "Tasks", url: "/tasks", icon: ClipboardList },
      { title: "Grades", url: "/grades", icon: BookA },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={"/"}>
          <Image
            src={"/assets/icons/CrossEvalLogo.png"}
            width={320}
            height={320}
            className="w-[140px] h-auto pl-2 pt-2"
            alt="CrossEval logo"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {loading ? <h1>Loading...</h1> : <NavUser user={data.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
