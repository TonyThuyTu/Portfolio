import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { contacts } from '@/db/schema';
import { eq } from 'drizzle-orm';

type Context = {
  params: Promise<{
    id: string;
  }>;
};

//get contact by id
export async function GET(
  _req: Request,
  context: Context
) {
  const { id } = await context.params; // ✅ IMPORTANT

  const contactId = Number(id);

  if (Number.isNaN(contactId)) {
    return NextResponse.json(
      { message: 'Invalid contact id' },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id_contact, contactId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { message: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

//delete contact by id
export async function DELETE(
  _req: Request,
  context: Context
) {
  const { id } = await context.params; // ✅ async params
  const contactId = Number(id);

  if (Number.isNaN(contactId)) {
    return NextResponse.json(
      { message: 'Invalid contact id' },
      { status: 400 }
    );
  }

  try {
    const deleted = await db
      .delete(contacts)
      .where(eq(contacts.id_contact, contactId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { message: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Contact deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

//check status contact by id
export async function PATCH(
  req: Request,
  context: Context
) {
  const { id } = await context.params;
  const contactId = Number(id);

  if (Number.isNaN(contactId)) {
    return NextResponse.json(
      { message: 'Invalid contact id' },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (typeof status !== 'number') {
      return NextResponse.json(
        { message: 'Status must be a number' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(contacts)
      .set({ status })
      .where(eq(contacts.id_contact, contactId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { message: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update status' },
      { status: 500 }
    );
  }
}
