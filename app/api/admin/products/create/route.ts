// app/api/admin/products/create/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      description,
      category,
      price,
      discountType,
      discountValue,
      images,
      status,
     sizes,
   } = body;

    // Validation
    if (!name?.trim() || !slug?.trim() || !category || !price) {
      const missing = [];
      if (!name?.trim()) missing.push("name");
      if (!slug?.trim()) missing.push("slug");
      if (!category) missing.push("category");
      if (!price) missing.push("price");
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missing.join(", ")}` 
        },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one product image is required" },
        { status: 400 }
      );
    }

    // Validate price
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid price value" },
        { status: 400 }
      );
    }

    // Validate discount if provided
    let parsedDiscountValue = null;
    if (discountValue) {
      parsedDiscountValue = Number(discountValue);
      if (isNaN(parsedDiscountValue) || parsedDiscountValue < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid discount value" },
          { status: 400 }
        );
      }
    }

    // Insert into database
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: name.trim(),
          slug: slug.trim(),
          description: description?.trim() || null,
          category,
          price: parsedPrice,
          discount_type: discountValue ? discountType : null,
          discount_value: parsedDiscountValue,
          images: images,
          status: status || "active",
            sizes: sizes || [],
             is_new_arrival: body.isNewArrival ?? true,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { 
          success: false, 
          message: error.message || "Failed to create product"
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}