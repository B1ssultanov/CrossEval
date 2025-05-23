import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

// Map English page slugs to their Russian equivalents
const pageNames: { [key: string]: string } = {
};

export default function BreadCrumbs() {
  const path = usePathname(); // Get the current path

  let currentLink: string = "";
  const crumbs: string[] = path ? path.split("/").filter((crumb) => crumb !== "") : [];

  // If the path is empty, set default to 'assistants'
  if (crumbs.length === 0) {
    crumbs[0] = "main page";
    currentLink = "";
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          currentLink += `/${crumb}`; // Build the link for each breadcrumb

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={currentLink}>
                  {pageNames[crumb] || crumb} {/* Display Russian name or fallback to the original */}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < crumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}