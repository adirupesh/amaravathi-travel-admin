import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  if(!request.headers.get("oai-authenticated-user-id")) return NextResponse.json({error:"Not authorized."},{status:401}); if(!env.BUCKET) return NextResponse.json({error:"Upload storage unavailable."},{status:503});
  const file=(await request.formData()).get("image"); if(!(file instanceof File)||!file.type.startsWith("image/")||file.size>5*1024*1024) return NextResponse.json({error:"Choose an image under 5 MB."},{status:400});
  const ext=file.name.split(".").pop()?.replace(/[^a-z0-9]/gi,"").toLowerCase()||"jpg", key=`inventory/${crypto.randomUUID()}.${ext}`; await env.BUCKET.put(key,file.stream(),{httpMetadata:{contentType:file.type}}); return NextResponse.json({key});
}
