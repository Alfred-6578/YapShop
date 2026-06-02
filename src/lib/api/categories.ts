import { api } from "./client";
import type { CategoryResponse } from "./types";

/** Flat list of categories. The response includes nullable parent_id for
 *  hierarchy, but for v1 we render a flat select. */
export async function listCategories(): Promise<CategoryResponse[]> {
  return api<CategoryResponse[]>("/categories/");
}
