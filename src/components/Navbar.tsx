"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  Store,
  LogOut,
  UserCircle2,
  Sparkles,
  Menu,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [initials, setInitials] = useState("U");
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("bullet.sidebar.collapsed") === "1";
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        const parts = user.email.split("@")[0].split(/[._-]/);
        const init = parts
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() || "")
          .join("");
        setInitials(init || "U");
      }
    });
  }, [supabase.auth]);

  useEffect(() => {
    window.localStorage.setItem("bullet.sidebar.collapsed", collapsed ? "1" : "0");
    document.documentElement.style.setProperty(
      "--app-sidebar-width",
      collapsed ? "4.75rem" : "256px"
    );
  }, [collapsed]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/submit", label: "Upload", icon: Upload },
    { href: "/marketplace", label: "Market", icon: Store },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-card-border bg-[#0b0b0d] transition-[width] duration-200 md:flex",
        collapsed ? "w-[4.75rem]" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col py-5",
          collapsed ? "px-3" : "px-4"
        )}
      >
        <div
          className={cn(
            "mb-7 flex items-center",
            collapsed ? "justify-center" : "gap-2 px-1"
          )}
        >
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={20} />
          </button>

          {!collapsed && (
            <Link
              href="/dashboard"
              className="flex w-[136px] items-center gap-2.5 text-foreground"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ec974b] text-white shadow-[0_8px_20px_rgba(249,115,22,0.15)]">
                <Sparkles size={16} strokeWidth={2.2} />
              </span>
              <span className="whitespace-nowrap text-[1.05rem] font-semibold tracking-tight leading-none">
                Bullet Studio
              </span>
            </Link>
          )}
        </div>

        <div className={cn("space-y-1.5", collapsed && "px-1")}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={cn(
                  "flex items-center rounded-2xl text-sm font-medium transition-colors",
                  collapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-2.5 px-3 py-2.5",
                  isActive
                    ? "bg-white/[0.07] text-foreground"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon size={18} strokeWidth={1.9} />
                {!collapsed && link.label}
              </Link>
            );
          })}
        </div>

        <div className={cn("mt-auto space-y-1.5 border-t border-card-border pt-4", collapsed && "px-1")}>
          <div
            className={cn(
              "flex items-center rounded-xl text-sm text-muted",
              collapsed ? "justify-center px-0 py-2" : "gap-2.5 px-3 py-2"
            )}
            title="Account"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent">
              {initials}
            </div>
            {!collapsed && (
              <>
                Account
                <UserCircle2 size={14} className="ml-auto opacity-60" />
              </>
            )}
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className={cn(
              "flex w-full items-center rounded-xl text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground",
              collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
            )}
          >
            <LogOut size={14} />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </div>
    </aside>
  );
}
