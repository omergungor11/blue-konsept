import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import routes from "./routes.json";

export type ReferenceRoute = {
  key: string;
  pageId: string;
  title: string;
  description: string;
  scripts: string[];
  attributes?: string[];
};

const references: Readonly<Record<string, ReferenceRoute>> = routes;

export function referencePaths() {
  return Object.keys(references);
}

export function referenceRoute(segments: string[] = []) {
  const pathname = "/" + segments.join("/");
  return Object.hasOwn(references, pathname) ? references[pathname] : undefined;
}

export const referenceMarkup = cache(async (key: string) => {
  return readFile(path.join(process.cwd(), "src/reference", key + ".html"), "utf8");
});
