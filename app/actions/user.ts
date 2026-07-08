"use server"
import prisma from "@/lib/db"

 

export async function getUser(id:string){
    try{
        const data = await prisma.user.findUnique({
            where : { id : id }
        })
        return { data : data , success: true };
    }catch(e){
          return { success: false, message: "unexpected error" };
    }
}

export async function updateUser(id : string , data : any){
    try{
        const res = await prisma.user.update({
            where : { id : id },
            data : {
                name : data.name ,
                email : data.email,
                phone : data.phone ,
                country : data.country,
                defaultLevel : data.level

            }
        })
        return { res : res , success: true };
    }catch(e){
        console.log(e)
          return { success: false, message: "unexpected error" };
    }
}