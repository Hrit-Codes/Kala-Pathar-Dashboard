import {cookies} from "next/headers";

export const serverGet=async(path:string):Promise<any>=>{
    const cookieStore=await cookies();
    const token=cookieStore.get("access_token")?.value;

    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            ...(token?{Cookie:`access_token=${token}`}:{})
        },
        cache:"no-store",
    })

    if(!res.ok) return null;
    return res.json();
}