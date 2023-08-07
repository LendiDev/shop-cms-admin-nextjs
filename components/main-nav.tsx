"use client";

import { cn } from "@/lib/utils";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

interface NavRoute {
  href: string;
  label: string;
  active: boolean;
}

export const getNavRoutes = (params: Params, pathname: string): NavRoute[] => {
  return [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname.includes(`/${params.storeId}/billboards`),
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname.includes(`/${params.storeId}/categories`),
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname.includes(`/${params.storeId}/sizes`),
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];
};

export const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const routes = getNavRoutes(params, pathname);

  return (
    <nav className="hidden sm:block">
      <ul className={cn("flex items-center space-x-4", className)}>
        {routes.map((route) => (
          <li key={route.href} onClick={() => router.refresh()}>
            <Link
              href={route.href}
              prefetch={false}
              className={cn(
                "text-m font-medium transition-colors hover:text-primary",
                route.active
                  ? "text-black dark:text-white"
                  : "text-muted-foreground "
              )}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
