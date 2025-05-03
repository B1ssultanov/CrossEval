"use client";

import { AppSidebar } from "@/components/shadcn-custom/sidebar/app-sidebar";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import BreadCrumbs from "../shadcn-custom/breadcrumps";
import ModeSwitch from "../shadcn-custom/modeSwitch";
import CreateOrJoinCourse from "../page-components/main-page/create-or-join-course";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // В будущем, страницы которые требуют запуска без сайдбара буду добавлять сюда
  const isNoSidebarPage =
    /^\/(register|login|verify-email|reset-password|forgot-password|privacy-policy|offer-agreement|cookie-policy|landing-page|landing-page\/contact-us)$/.test(
      pathname
    );

  return (
    <>
      <Provider store={store}>
        {!isNoSidebarPage && (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-white">
              <header className="flex h-16 shrink-0 sticky top-0 z-50 bg-white items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow">
                <div className="flex items-center  justify-between w-full">
                  <div className="flex items-center justify-between w-full gap-2 px-4">
                    <div className="flex items-center">
                      <SidebarTrigger className="-ml-1" />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <BreadCrumbs />
                    </div>

                    <div className="flex">
                      <CreateOrJoinCourse />
                      <ModeSwitch />
                    </div>
                  </div>
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        )}

        {isNoSidebarPage && (
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min bg-white">
            {children}
          </div>
        )}
      </Provider>
    </>
  );
}
