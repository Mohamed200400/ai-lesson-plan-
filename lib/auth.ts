import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcrypt";


export const authOptions: NextAuthOptions ={
    providers : [
        CredentialsProvider ({
            name: "credentials",
            credentials :{
                email :{
                    label : "Email",
                    type : "email",
                    placeholder: "example@email.com",
                },
                password : {
                    label : "Password",
                    type : "password"
                },
            },
            async authorize(credentials){
                
                if (!credentials?.email || !credentials?.password) {
                    return null; // Returning null tells NextAuth the sign-in failed
                }

                // 2. Look for the user in your database via Prisma
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                // 3. If the user doesn't exist, stop here
                if (!user) {
                    return null; 
                }

                // 4. Compare the typed password with the hashed password in the DB
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null; 
                }

                // 5. Success! Return the user data (NextAuth will now generate a valid session)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            }
        }),

    ],
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/login', 
    },
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