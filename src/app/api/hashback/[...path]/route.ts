const HASHBACK_ORIGIN = "https://api.hashback.co.ke";

async function handler(
  request: Request,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;
  const url = new URL(request.url);

  // Build target URL: https://api.hashback.co.ke/<path>?<query>
  const target = new URL(`${HASHBACK_ORIGIN}/${path.join("/")}`);
  target.search = url.search;

  // Forward request (method + headers + body)
  const upstream = await fetch(target, {
    method: request.method,
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
    },
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text(),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const POST = handler;
export const GET = handler;

