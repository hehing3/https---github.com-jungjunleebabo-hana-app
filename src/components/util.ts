import { revalidatePath, revalidateTag } from 'next/cache';

export function reLoadPage(path: string, tag: string) {
  revalidateTag(tag);
  // Redirect them back to the Homepage
  revalidatePath(path);
}
