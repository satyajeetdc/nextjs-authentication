"use server";

import connectToDB from "@/database";
import User from "@/models";

export async function registerUserAction() {
  await connectToDB();

  try {
    const { username, email, password } = formData;

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return {
        success: false,
        message: "Uaer already exists with the same email id.",
      };
    }

    const salt = bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newlyCreatedUser.save();

    if (savedUser) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(savedUser)),
      };
    } else {
      return {
        success: false,
        message: "Something went wrong !!! Please try again.",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong !!! Please try again.",
    };
  }
}
