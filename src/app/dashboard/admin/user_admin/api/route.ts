import { config } from '@/config';

export async function GET(request: Request) {
  //const { searchParams } = new URL(request.url);
  // const id = searchParams.get('id');
  const res = await fetch(`${config.site.serverUrl}/admin/UserListMap`, {
    headers: {
      'Content-Type': 'application/json',
      // 'API-Key': process.env.DATA_API_KEY!,
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
