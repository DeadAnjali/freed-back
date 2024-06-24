import dbConnect from "@/lib/dbConnect";
import { z } from 'zod';
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation
})


export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get('username')
    }

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: "Invalid username",
      }, {
        status: 400
      })
    }
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true
    })

    if(existingUser) {
      return Response.json({
        success: false,
        message: "Username already taken",
      }, {
        status: 400
      }) 
    }
    return Response.json({
      success: true,
      message: "Username is unique",
    }, {
      status: 400
    })
  } catch (err) {
    console.log("Error checking username", err);
    return Response.json({
      success: false,
      message: "Error checking username",
    }, {
      status: 500
    })
  }

}