import { NextResponse } from "next/server";
import { db } from '@/db/drizzle';
import { contacts } from "@/db/schema";

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
  const data = await db.select().from(contacts).orderBy(contacts.id_contact);

  return NextResponse.json({ success: true, data });
}

