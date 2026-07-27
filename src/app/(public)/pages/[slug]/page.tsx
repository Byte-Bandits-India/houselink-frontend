"use client"

import { useParams } from "next/navigation"
import CmsPageRenderer from "@/components/cms/CmsPageRenderer"

export default function DynamicCmsPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug || ""

  return <CmsPageRenderer slug={slug} />
}
