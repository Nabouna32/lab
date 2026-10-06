import type { ReactNode } from "react";

export default function AppShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="loculary-app relative min-h-screen overflow-x-clip">
      <div className="loculary-atmosphere" aria-hidden="true">
        <span className="loculary-orb loculary-orb-a" />
        <span className="loculary-orb loculary-orb-b" />
        <span className="loculary-grid" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[108rem] flex-col px-0 sm:px-3 lg:px-5 xl:px-7">
        <div className="loculary-frame flex min-h-[100svh] flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              className="min-h-0 flex-1"
              style={{ viewTransitionName: "loculary-workspace" }}
            >
              {children}
            </div>
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
