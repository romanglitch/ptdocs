import React from "react";

export const Main = ({
                       children,
                     }: {
  children: React.ReactNode;
}) => {
  return (
      <main className="ptdocs-main mx-auto w-full pt-16 px-6 flex-grow mt-5">
        {children}
      </main>
  );
};
