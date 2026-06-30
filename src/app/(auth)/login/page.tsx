"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { BackgroundEffects } from "@/src/components/layout/BackgroundEffects";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/src/lib/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router= useRouter();

    const { register, handleSubmit, formState:{errors}}=useForm<LoginFormValues>({resolver:zodResolver(loginSchema)});

    const loginMutation=useMutation({
        mutationFn:login,
        onSuccess:()=>{
            toast.success("Welcome back");
            router.push("/dashboard");
        },
        onError:(error:any)=>{
            const message= error.response?.data?.message || "Invalid email or password";
            toast.error(message);
        }
    })

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4">
            <BackgroundEffects/>
            <div className="relative z-10 w-full max-w-sm">
                {/* Brand mark */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Image src="/Logo.png" alt="Kala Patthar Logo" width={48} height={48}/>
                    </div>
                    <h1 className="tracking-tight">
                        Kala Patthar
                    </h1>
                    <p className="text-description mt-1">
                        Sign in to manage your expeditions
                    </p>
                </div>

                {/* Card */}
                <div className="bg-section rounded-2xl border border-gray-200 shadow-sm p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-md font-medium mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@kalapatthar.com"
                                {...register("email",{required:true})}
                                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-secondary-950 placeholder:text-gray-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600 mt-1.5">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-md font-medium "
                                >
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-xs font-medium text-secondary-500 hover:text-secondary-600"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password",{required:true})}
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-10 text-sm text-secondary-950 placeholder:text-gray-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-600 mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 hover:cursor-pointer"
                        >
                            {loginMutation.isPending ? "Signing in...":"Sign in"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Kala Patthar Treks & Expedition — Admin Dashboard
                </p>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Powered By <a href="https://www.magnas.com.np/" className="hover:cursor-pointer hover:underline hover:text-primary-400">Magnas InfoTech Solutions</a>
                </p>
            </div>
        </div>
    );
}