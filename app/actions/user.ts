"use server"
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db"
import { updateUserSchema, type UpdateUserInput } from "@/lib/validations/user";
import { getServerSession } from "next-auth";

 

export async function getUser(){

    const session = await getServerSession(authOptions)
      if (!session || !session.user) {
    throw new Error("You must be logged in to like a lesson.");
  }

const id = (session.user as { id: string }).id;

    try{
        const data = await prisma.user.findUnique({
            where : { id : id }
        })
        return { data : data , success: true };
    }catch(e){
          return { success: false, message: "unexpected error" };
    }
}

export async function updateUser(data: UpdateUserInput){
    const session = await getServerSession(authOptions)
      if (!session || !session.user) {
    throw new Error("You must be logged in to like a lesson.");
  }

const id = (session.user as { id: string }).id;
    try{
        // Validate profile data on the server too. Client-side form controls help
        // the user, but they do not protect the database from crafted requests.
        const input = updateUserSchema.parse(data)
        const res = await prisma.user.update({
            where : { id : id },
            data : {
                name : input.name ,
                email : input.email,
                phone : input.phone ,
                country : input.country,
                defaultLevel : input.level

            }
        })
        return { res : res , success: true };
    }catch(e){
        console.log(e)
          return { success: false, message: "unexpected error" };
    }
}

export async function updateUserImage( image: string){
    const session = await getServerSession(authOptions)
      if (!session || !session.user) {
    throw new Error("You must be logged in to like a lesson.");
  }

const id = (session.user as { id: string }).id;
    try{
        const res = await prisma.user.update({
            where : { id : id },
            data : {
                image : image

            }
        })
        return { res : res , success: true };
    }catch(e){
        console.log(e)
          return { success: false, message: "unexpected error" };
    }
}
