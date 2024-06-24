import { authOption } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;
  
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated",
    }, {
      status: 401
    })
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  
  await dbConnect();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      isAcceptingMessages: acceptMessages
    }, {
      new:true
    })

    if (!updatedUser) {
      return Response.json({
        success: false,
        message: "Failed to update user status to accept messages",
      }, {
        status: 401
      })  
    }
    return Response.json({
      success: true,
      message: "Updated user status to accept messages Successfully",
      updatedUser
    }, {
      status: 200
    })
  } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return Response.json({
      success: false,
      message: "failed to update user status to accept messages",
    }, {
      status: 500
    })
  }

}

export async function GET(request: Request) {
  await dbConnect();
  
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated",
    }, {
      status: 401
    })
  }

  const userId = user._id;
  
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json({
        success: false,
        message: "Failed to find the user",
      }, {
        status: 404
      })
    }
    return Response.json({
      success: true,
      isAcceptingMessages: foundUser.isAcceptingMessages,
    }, {
      status: 200
    })
  } catch (error) {
    console.log("failed to get user status of accepting messages", error);
    return Response.json({
      success: false,
      message: "failed to get user status of accepting messages",
    }, {
      status: 500
    })
  }

}