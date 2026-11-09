import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { referenceMarkup, referencePaths, referenceRoute } from "@/lib/reference";

type PageProps = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return referencePaths().map((pathname) => ({ slug: pathname.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const route = referenceRoute((await params).slug);
  if (!route) return {};
  return { title: route.title, description: route.description, icons: "/brand-icon.png" };
}

export default async function Page({ params }: PageProps) {
  const route = referenceRoute((await params).slug);
  if (!route) notFound();

  return (
    <>
      <script data-page={route.pageId} src="/concept-prepare.js" />
      <div className="concept-content" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: await referenceMarkup(route.key) }} />
      {route.scripts.map((src) => <script key={src} src={src} defer />)}
      {route.attributes && (
        <script type="module" src="/vendor/finsweet/attributes.js" {...Object.fromEntries(route.attributes.map((attribute) => [attribute, ""]))} />
      )}
    </>
  );
}
