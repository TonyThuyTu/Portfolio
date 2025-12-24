import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/slug.generate;
import { uploadFile } from '@/lib/uploads';

type Context = {

  params: Promise<{
    id: string;
  }>;

};

//get project by ID 
export async function GET(
  _req: Request,
  context: Context
) {
  const { id } = await context.params; // ✅ IMPORTANT

  const projectId = Number(id);

  if (Number.isNaN(projectId)) {
    return NextResponse.json(
      { message: 'Invalid contact id' },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id_project, projectId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

//update project by ID

