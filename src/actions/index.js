"use server";

import connectToDB from "@/database";
import User from "@/models";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function registerUserAction(formData) {
  await connectToDB();

  try {
    const { username, email, password } = formData;

    const checkUser = await User.findOne({ email });
    console.log(checkUser);

    if (checkUser) {
      return {
        success: false,
        message: "User already exists ! Please try with different email",
      };
    }

    const salt = await bcryptjs.genSalt(10);
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
        message: "Something went wrong! Please try again",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something error occured",
    };
  }
}

export async function loginUserAction(formData) {
  await connectToDB();

  try {
    const { username, email, password } = formData;

    const checkUser = await User.findOne({ email });
    console.log(checkUser);

    if (!checkUser) {
      return {
        success: false,
        message: "User does not exist. Please sign up.",
      };
    }

    const checkPassword = await bcryptjs.compare(password, checkUser.password);

    if (!checkPassword) {
      return {
        success: false,
        message:
          "Password is incorrect. Please login with the correct passsword.",
      };
    }

    const createdTokenData = {
      id: checkUser._id,
      username: checkUser.username,
      email: checkUser.email,
    };

    const token = jwt.sign(createdTokenData, "DEFAULT_KEY", {
      expiresIn: "1d",
    });

    const getCookies = cookies();
    getCookies.set("token", token);

    return {
      success: true,
      message: "Login successfull.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Some error occured !!! Please try again.",
    };
  }
}

export async function fetchAuthUserAction() {
  await connectToDB();

  try {
    const getCookies = cookies();
    const token = getCookies.get("token")?.value || "";

    if (token === "") {
      return {
        success: false,
        message: "Token is invalid",
      };
    }

    const decodedToken = jwt.verify(token, "DEFAULT_KEY");

    const getUserInfo = await User.findOne({ _id: decodedToken.id });

    if (getUserInfo) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(getUserInfo)),
      };
    } else {
      return {
        success: false,
        message: "Some error occured !!! Please try again.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Some error occured !!! Please try again.",
    };
  }
}

export async function logoutAction() {
  const getCookies = cookies();
  getCookies.set("token", "");
}
