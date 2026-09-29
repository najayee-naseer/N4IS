import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { CMS_TAG } from "@/lib/supabase/public";

/**
 * After any content save: drop every cached public read and every rendered
 * public page, so the next visitor sees the change. Content changes are rare
 * and the site is small, so refreshing everything is simpler and safer than
 * tracking which pages a given edit touched.
 */
export function revalidateCms() {
  revalidateTag(CMS_TAG);
  revalidatePath("/", "layout");
}
