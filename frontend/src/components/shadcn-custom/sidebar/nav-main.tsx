"use client";

import React from "react";
import { useState } from "react";
import { House, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight, GraduationCap } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const courses = ["Course 1", "Course 2", "Course 3"];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
            <SidebarMenuItem
            key={item.title}
            className={`${
              pathname === item.url &&
              "bg-indigo-200 bg-gradient-to-l from-sky-400/80 to-sky-600/80 text-white text-lg rounded-md"
            }`}
            >
            <Link href={item.url}>
              <SidebarMenuButton tooltip={item.title}>
              <p>{item.icon && <item.icon />}</p>
              <span className="text-base font-thin">{item.title}</span>
              </SidebarMenuButton>
            </Link>
            </SidebarMenuItem>
        ))}
        <SidebarSeparator />

        {/* Collapsible My Courses Section */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer rounded-md hover:bg-gray-100">
              <SidebarMenuItem
                className={`${
                  pathname === "My Courses" &&
                  "bg-[#CBEEF9] text-gray-900 rounded-md"
                }`}
              >
                <div className="flex items-center p-2">
                  <House className="w-8 h-8" />
                  <SidebarMenuButton tooltip={"My Courses"}>
                    <span className=""> My Courses</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 mt-2">
            {courses.length > 0 ? (
              <ul className="space-y-2">
                {courses.map((course, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <GraduationCap size={25} className="mr-2 text-gray-600" />
                    {course}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No courses available.</p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
