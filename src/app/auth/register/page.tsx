import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldDescription, Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Link from "next/link";
import RegisterForm from "./register-form";

export default function Home() {
    return(
        <div className="w-full flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium md:text-2xl">
                    {/* <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div> */}
                    Heylabs
                </Link>
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">Create an account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RegisterForm/>
                        </CardContent>
                    </Card>
                    <FieldDescription className="px-6 text-center">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </div>
    )
}