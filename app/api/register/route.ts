import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import signJWT from "@/utils/signJWT";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectDB();
    console.log("start");

    const { username, email, password } = await req.json();
    const user = await User.findOne({ email });
    if (user) {
      return new Response("Email already in use", { status: 400 });
    }

    const newUser = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password),
    });

    const jwt = signJWT(newUser.toObject());

    return Response.json({ success: true, data: newUser, token: jwt });
  } catch (err: any) {
    console.log(err);
    return new Response("An error occured", {
      status: 400,
    });
  }
};
