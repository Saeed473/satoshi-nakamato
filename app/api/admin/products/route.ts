// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";

    // Build query
    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply search filter
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Apply status filter
    if (filter === "active") {
      query = query.eq("status", "active");
    } else if (filter === "draft") {
      query = query.eq("status", "draft");
    } else if (filter === "out_of_stock") {
      query = query.eq("stock", 0);
    } else if (filter === "low_stock") {
      query = query.gt("stock", 0).lt("stock", 20);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}