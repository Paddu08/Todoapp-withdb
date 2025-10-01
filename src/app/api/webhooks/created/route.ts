import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { db } from '@/db/index';
import { usersTable } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === 'user.created') {
      // Construct name, fallback to email if first/last name missing
      const name =(evt.data.first_name)?`${evt.data.first_name}` :"Unkown user"

      const id = evt?.data?.id;
      const createdAt= new Date(evt.data.created_at)

      await db.insert(usersTable).values({
        name: name,
        auth_id: id,
        createdAt:createdAt
      });

      console.log('User created:', evt.data);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
