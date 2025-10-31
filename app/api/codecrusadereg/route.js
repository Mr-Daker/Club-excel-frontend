import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const body = await req.json();
    console.log("Received body:", body);
    const db = client.db("clubexcel");
    
    const result = await contacts.insertOne({
      ...body,
      timestamp: new Date(),
      createdAt: Date.now(),
    });
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 200 });
  } catch (err) {
    console.error("Error saving contact data:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
