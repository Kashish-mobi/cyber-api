"use client";

import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  return (
    <NextTopLoader
      color="#000000"
      height={3}
      showSpinner={false}
      template='<div class="bar" role="bar"><div class="peg"></div></div>'
    />
  );
}
