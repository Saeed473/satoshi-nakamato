// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

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
      isNewArrival
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
          message: `Missing required fields: ${missing.join(", ")}`,
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

    // Update product
    const { data, error } = await supabase
      .from("products")
      .update({
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
        updated_at: new Date().toISOString(),

      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to update product",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Delete the product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}