
interface Env {
  // Fixed: Replaced missing KVNamespace type with any to resolve 'Cannot find name' error
  STATS_KV: any;
}

// Fixed: Replaced missing PagesFunction type with an explicit function signature and any-typed context to resolve 'Cannot find name' error
export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  
  try {
    const data: any = await request.json();
    const { mep, totalMep } = data;

    // Example: Storing high scores at the edge
    // await env.STATS_KV.put('latest_session', JSON.stringify({ mep, totalMep, date: new Date().toISOString() }));

    return new Response(JSON.stringify({ 
      success: true, 
      received: mep,
      note: "Data received at the edge" 
    }), {
      headers: { "content-type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }
};