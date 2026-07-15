import { getProperty } from "@/lib/api";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ShortUrlPageProps = {
  params: Promise<{ id: string }>;
}

export default async function ShortUrlPage({ params }: ShortUrlPageProps) {
  const { id } = await params;
  const propId = Number(id);

  if (isNaN(propId)) {
    return notFound();
  }

  let property: any = null;
  try {
    const res = await getProperty(propId);
    property = res.data;
  } catch (err) {
    console.error("Error fetching property in short URL redirect:", err);
  }

  if (property && property.permalink) {
    return redirect(`/properties/${property.permalink}`);
  }

  return notFound();
}
