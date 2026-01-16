
// Fixed: Replaced missing PagesFunction type with an explicit function signature and any-typed context to resolve 'Cannot find name' error
export const onRequest = async (context: any) => {
  return new Response(JSON.stringify({
    message: "Welcome to the Monster Clicker API",
    status: "online",
    timestamp: Date.now()
  }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
};