
// Fixed: Replaced missing PagesFunction type with an explicit function signature and any-typed context to resolve 'Cannot find name' error
export const onRequest = async (context: any) => {
  const config = {
    features: {
      rebirthEnabled: true,
      adminPanelEnabled: true,
      cratesEnabled: true
    },
    maintenance: false,
    motd: "Keep clicking, stay caffeinated!"
  };

  return new Response(JSON.stringify(config), {
    headers: { "content-type": "application/json" }
  });
};