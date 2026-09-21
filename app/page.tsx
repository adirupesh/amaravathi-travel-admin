import { requireChatGPTUser } from "./chatgpt-auth";
import { InventoryManager, InventoryItem } from "./inventory-manager";
import inventoryData from "../data/inventory.json";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/");
  const items = inventoryData as InventoryItem[];
  return <InventoryManager initialItems={items} userName={user.displayName} />;
}
