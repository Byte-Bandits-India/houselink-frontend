import React from "react";
import Link from "next/link";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemProps {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="w-full bg-[#163D75] py-5 px-4 md:px-8 text-white/90 text-xs sm:text-sm font-medium select-none">
      <div className="container mx-auto px-4">
        <ShadcnBreadcrumb>
          <BreadcrumbList className="text-white/80 flex-wrap">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast || !item.href ? (
                      <BreadcrumbPage className="text-white/80 truncate font-medium max-w-[200px] sm:max-w-none">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="hover:text-white transition-colors underline underline-offset-2"
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="text-white/50" />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </ShadcnBreadcrumb>
      </div>
    </div>
  );
}
