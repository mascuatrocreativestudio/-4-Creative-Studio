import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect en cliente, useEffect en SSR (evita el warning de React). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
