import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions ={
    providers : [
        CredentialsProvider ({
            name: "credentials",
            credentials :{
                email :{
                    lebel : "Email",
                    type : "email",
                    placeholder: "example@email.com",
                },
                password : {
                    label : "Password",
                    type : "password"
                },
            },
            async authorize(credentials){
                
                return{
                    id : "1",
                    name: "med"
                }
            }
        }),

    ],
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks :{
        async jwt({token ,user}){
            if (user){
                token.id = user.id
            }
            return token
        },
        async session({session, token}){
            if(session.user){
                //@ts-ignore
                session.user.id = token.id
            }
            return session
        }
    }
}