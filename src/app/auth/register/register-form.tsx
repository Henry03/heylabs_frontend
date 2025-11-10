"use client"

import { FieldDescription, Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [email, setEmail] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
    const [otp, setOtp] = useState<string>("");
    const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const router = useRouter();
    const [cooldown, setCooldown] = useState<number>(0);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            email,
            name,
            username,
            password,
            passwordConfirmation
        }

        const request = axiosInstance.post('/v1/auth/register', payload);

        toast.promise(request,{
            loading: 'Registering...',
            success: (res) => {
                setIsOtpStep(true);
                setCooldown(60);
                const timer = setInterval(() => {
                    setCooldown((prev) => {
                        if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                return res.data.message
            },
            error: (err) => {
                console.log(err.response.data.errors)
                setErrors(err.response.data.errors)
                return err.response.data.message
            }
        })
    }

    const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const request = axiosInstance.post("/v1/auth/verify-otp", { email, otp });

        toast.promise(request, {
        loading: "Verifying OTP...",
        success: (res) => {
            router.push("/auth/login");
            return res.data.message;
        },
        error: (err) => {
            return err.response?.data?.message || "OTP verification failed.";
        },
        });
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;

        const request = axiosInstance.post("/v1/auth/resend-otp", { email });

        toast.promise(request, {
        loading: "Sending OTP...",
        success: (res) => {
            setCooldown(60);
            const timer = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return res.data.message;
        },
        error: (err) => {
            return err.response?.data?.message || "Failed to resend OTP.";
        },
        });
    };

    return(
        <>
            {!isOtpStep ? (
                <form onSubmit={(e) => handleLogin(e)}>
                    <FieldGroup className="gap-2">
                        <Field data-invalid={!!errors.email?.length}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@heylabs.id"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                aria-invalid={!!errors.email?.length}
                            />
                            <FieldError errors={errors.email}/>
                        </Field>
                        <Field data-invalid={!!errors.name?.length}>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder="heylabs"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                aria-invalid={!!errors.name?.length}
                            />
                            <FieldError errors={errors.name}/>
                        </Field>
                        <Field data-invalid={!!errors.username?.length}>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                type="text"
                                placeholder="heylabs03"
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)}
                                aria-invalid={!!errors.username?.length}
                            />
                            <FieldError errors={errors.username}/>
                        </Field>
                        <Field data-invalid={!!errors.password?.length}>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
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
                        <Field data-invalid={!!errors.passwordConfirmation?.length}>
                            <FieldLabel htmlFor="passwordConfirmation">Password Confirmation</FieldLabel>
                            <Input 
                                id="passwordConfirmation" 
                                type="password" 
                                placeholder="••••••" 
                                value={passwordConfirmation}
                                onChange={(e)=>setPasswordConfirmation(e.target.value)}
                                aria-invalid={!!errors.passwordConfirmation?.length}
                            />
                            <FieldError errors={errors.passwordConfirmation}/>
                        </Field>
                        <Field className="mt-3">
                            <Button type="submit">Register</Button>
                            <FieldDescription className="text-center">
                                Already have account? <Link href="/auth/register">Login</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            ):(
            <form onSubmit={handleVerifyOtp}>
                <FieldGroup className="gap-2">
                    <Field>
                    <FieldLabel htmlFor="otp">Enter 6-digit OTP</FieldLabel>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    </Field>

                    <Field className="mt-2 flex items-center justify-between">
                    <Button type="submit">Verify</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendOtp}
                        disabled={cooldown > 0}
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                    </Button>
                    </Field>

                    <FieldDescription className="text-center mt-2">
                    Check your email <strong>{email}</strong> for the OTP.
                    </FieldDescription>
                </FieldGroup>
            </form>
                
            )}
        </>
    )
}