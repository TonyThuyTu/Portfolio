import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/slug.generate";
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
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (Number.isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project id" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    // basic fields
    const name = formData.get("name") as string;
    const short_desc = formData.get("short_desc") as string;
    const long_desc = formData.get("long_desc") as string;
    const source = formData.get("source") as string;

    // dates
    const start_date_raw = formData.get("start_date") as string | null;
    const end_date_raw = formData.get("end_date") as string | null;

    if (!start_date_raw) {
      return NextResponse.json(
        { message: "start_date is required" },
        { status: 400 }
      );
    }

    const start_date = new Date(start_date_raw);
    const end_date = end_date_raw ? new Date(end_date_raw) : null;

    if (Number.isNaN(start_date.getTime())) {
      return NextResponse.json(
        { message: "Invalid start_date format (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    // tech stack
    const tech_stack = JSON.parse(
      formData.get("tech_stack") as string
    );

    // images (optional on update)
    const imgCoverFile = formData.get("img_cover") as File | null;
    const imageFiles = formData.getAll("images") as File[];

    if (!name || !short_desc || !long_desc) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // fetch existing project
    const [existing] = await db
      .select()
      .from(projects)
      .where(eq(projects.id_project, projectId))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // slug logic
    let slug = existing.slug;
    if (name !== existing.name) {
      slug = generateSlug(name);
    }

    // cover image
    let img_cover = existing.img_cover;
    if (imgCoverFile && imgCoverFile.size > 0) {
      const uploaded = await uploadFile(imgCoverFile, {
        folder: "projects",
      });
      img_cover = uploaded.url;
    }

    // gallery images
    let images = existing.images as string[];
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      images = [];
      for (const file of imageFiles) {
        const uploaded = await uploadFile(file, {
          folder: "projects",
        });
        images.push(uploaded.url);
      }
    }

    // update
    const [updated] = await db
      .update(projects)
      .set({
        name,
        slug,
        short_desc,
        long_desc,
        img_cover,
        images,
        tech_stack,
        source,
        start_date,
        end_date,
      })
      .where(eq(projects.id_project, projectId))
      .returning();

    return NextResponse.json({
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

