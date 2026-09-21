import { env } from "cloudflare:workers";
import { requireChatGPTUser } from "./chatgpt-auth";
import { InventoryManager, InventoryItem } from "./inventory-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/");
  let items: InventoryItem[] = [];
  if (env.DB) {
    const result = await env.DB.prepare("SELECT id, type, name, location, description, price, status, image_key AS imageKey, created_at AS createdAt, updated_at AS updatedAt FROM inventory ORDER BY updated_at DESC").all<InventoryItem>();
    items = result.results;
  }
  return <InventoryManager initialItems={items} userName={user.displayName} />;
}
