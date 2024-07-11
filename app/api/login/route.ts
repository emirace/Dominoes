import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import signJWT from "@/utils/signJWT";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectDB();
    console.log("start");

    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return new Response("Invalid credentials", { status: 400 });
    }
    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return new Response("Invalid credentials", { status: 400 });
    }

    const jwt = signJWT(user.toObject());

    return Response.json({ success: true, data: user, token: jwt });
  } catch (err: any) {
    console.log(err);
    return new Response("An error occured", {
      status: 400,
    });
  }
};
