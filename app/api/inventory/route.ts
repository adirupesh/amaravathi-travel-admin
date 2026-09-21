import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
const types = new Set(["hotel", "car", "area", "experience"]), statuses = new Set(["draft", "active", "archived"]);
const clean = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max) : "";
const auth = (r: Request) => Boolean(r.headers.get("oai-authenticated-user-id"));
function values(data: Record<string, unknown> | null) {
  const type=clean(data?.type,30), name=clean(data?.name,100), location=clean(data?.location,100), description=clean(data?.description,1500), status=clean(data?.status,20), imageKey=clean(data?.imageKey,220)||null;
  const price=data?.price===""||data?.price==null?null:Math.round(Number(data.price));
  return { type,name,location,description,status,imageKey,price,valid:types.has(type)&&!!name&&!!location&&statuses.has(status)&&(price===null||(Number.isFinite(price)&&price>=0)) };
}
export async function POST(request: Request) {
  if(!auth(request)) return NextResponse.json({error:"Not authorized."},{status:401}); if(!env.DB) return NextResponse.json({error:"Storage unavailable."},{status:503});
  const v=values(await request.json().catch(()=>null) as Record<string,unknown>|null); if(!v.valid) return NextResponse.json({error:"Please check the required fields."},{status:400}); const now=new Date().toISOString();
  const row=await env.DB.prepare("INSERT INTO inventory (type,name,location,description,price,status,image_key,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?) RETURNING id").bind(v.type,v.name,v.location,v.description,v.price,v.status,v.imageKey,now,now).first<{id:number}>(); return NextResponse.json({id:row?.id},{status:201});
}
export async function PUT(request: Request) {
  if(!auth(request)) return NextResponse.json({error:"Not authorized."},{status:401}); if(!env.DB) return NextResponse.json({error:"Storage unavailable."},{status:503});
  const data=await request.json().catch(()=>null) as Record<string,unknown>|null, id=Number(data?.id), v=values(data); if(!Number.isInteger(id)||!v.valid) return NextResponse.json({error:"Please check the required fields."},{status:400});
  await env.DB.prepare("UPDATE inventory SET type=?,name=?,location=?,description=?,price=?,status=?,image_key=?,updated_at=? WHERE id=?").bind(v.type,v.name,v.location,v.description,v.price,v.status,v.imageKey,new Date().toISOString(),id).run(); return NextResponse.json({ok:true});
}
export async function DELETE(request: Request) {
  if(!auth(request)) return NextResponse.json({error:"Not authorized."},{status:401}); if(!env.DB) return NextResponse.json({error:"Storage unavailable."},{status:503}); const id=Number(new URL(request.url).searchParams.get("id")); if(!Number.isInteger(id)) return NextResponse.json({error:"Invalid item."},{status:400});
  const item=await env.DB.prepare("SELECT image_key AS imageKey FROM inventory WHERE id=?").bind(id).first<{imageKey:string|null}>(); await env.DB.prepare("DELETE FROM inventory WHERE id=?").bind(id).run(); if(item?.imageKey&&env.BUCKET) await env.BUCKET.delete(item.imageKey); return NextResponse.json({ok:true});
}
