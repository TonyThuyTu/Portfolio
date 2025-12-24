import { NextResponse } from "next/server";
import { db } from '@/db/drizzle';
import { contacts } from "@/db/schema";
import { desc } from "drizzle-orm";

//create contact
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    await db.insert(contacts).values({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

//get all contacts
export async function GET() {

  try {

    const listContacts = await db.select({
      
      id_contact: contacts.id_contact,
      name: contacts.name,
      email: contacts.email,
      subject: contacts.subject,
      status: contacts.status,

    }).from(contacts).orderBy(desc(contacts.id_contact));

    return NextResponse.json(listContacts, { status: 200 });

  } catch (error) {

    console.error('get contacts error:', error);
    return NextResponse.json(

      { message: 'Server error' },
      { status: 500 }

    );

  }

}

