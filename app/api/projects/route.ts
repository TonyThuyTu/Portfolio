import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { generateSlug } from "@/lib/slug.generate";
import { uploadFile } from "@/lib/uploads";
import { desc } from "drizzle-orm";
//create project
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // basic fields
    const name = formData.get("name") as string;
    const short_desc = formData.get("short_desc") as string;
    const long_desc = formData.get("long_desc") as string;
    const source = formData.get("source") as string;

    // dates (FIX)
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

    // images
    const imgCoverFile = formData.get("img_cover") as File;
    const imageFiles = formData.getAll("images") as File[];

    if (!name || !short_desc || !long_desc || !imgCoverFile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // upload cover
    const cover = await uploadFile(imgCoverFile, {
      folder: "projects",
    });

    // upload gallery
    const images: string[] = [];
    for (const file of imageFiles) {
      const uploaded = await uploadFile(file, {
        folder: "projects",
      });
      images.push(uploaded.url);
    }

    const slug = generateSlug(name);

    // insert (FIX)
    const [project] = await db
      .insert(projects)
      .values({
        name,
        slug,
        short_desc,
        long_desc,
        img_cover: cover.url,
        images,
        tech_stack,
        source,
        start_date,
        end_date,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Project created successfully",
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

//get all projects
export async function GET() {
  
  try {

    const listProjects = await db.select({
      
      id_project: projects.id_project,
      name: projects.name,
      img_cover: projects.img_cover,
      short_desc: projects.short_desc,

    }).from(projects).orderBy(desc(projects.id_project));

    return NextResponse.json(listProjects, { status: 200 });

  } catch (error) {

    console.error('get projects error:', error);
    return NextResponse.json(

      { message: 'Server error' },
      { status: 500 }

    );

  }

} 
