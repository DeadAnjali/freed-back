import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername
    })

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      }, {
        status: 400
      })
    }

    const isValidCode = code === user.verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isValidCode && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json({
        success: true,
        message: "User verified successfully",
      }, {
        status: 200
      })
    } else if (!isCodeNotExpired) { 
      return Response.json({
        success: false,
        message: "Verification code has expired, please sign up again to get a new code",
      }, {
        status: 400
      })
    } else {
      return Response.json({
        success: false,
        message: "Incorrect Verification Code",
      }, {
        status: 400
      })
    }
  } catch (err) {
    console.log("Error Verifying code", err);
    return Response.json({
      success: false,
      message: "Error Verifying code",
    }, {
      status: 500
    })
  }
}
