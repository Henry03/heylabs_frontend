"use client"

import { FieldDescription, Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function LoginForm() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const router = useRouter();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            email,
            password
        }

        const request = axiosInstance.post('/v1/auth/login', payload);

        toast.promise(request,{
            loading: 'Login in...',
            success: (res) => {
                Cookies.set('token', res.data.data.token, { secure: true, sameSite: 'Strict' });
            
                router.push('/console/ocr/ktp');
                return res.data.message
            },
            error: (err) => {
                console.log(err.response.data.errors)
                setErrors(err.response.data.errors)
                return err.response.data.message
            }
        })
    }
    return(
        <form onSubmit={(e) => handleLogin(e)}>
            <FieldGroup>
                <Field data-invalid={!!errors.email?.length}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="example@hilabs.id"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        aria-invalid={!!errors.email?.length}
                    />
                    <FieldError errors={errors.email}/>
                </Field>
                <Field data-invalid={!!errors.password?.length}>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••" 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        aria-invalid={!!errors.password?.length}
                    />
                    <FieldError errors={errors.password}/>
                </Field>
                <Field>
                    <Button type="submit">Login</Button>
                    <FieldDescription className="text-center">
                    Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}