import { api } from "./api";


export interface LoginPayload{
    email:string;
    password:string;
}

export const login=async(payload:LoginPayload)=>{
    const {data}= await api.post("/auth/login",payload);
    return data;
}

export const logout=async()=>{
    const {data}= await api.post("/auth/logout");
    return data;
}

export const refreshAccessToken=async()=>{
    const {data}= await api.post("/auth/refreshAccessToken");
    return data;
}