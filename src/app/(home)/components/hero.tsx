import Link from "next/link";
import { Button } from "../../../components/ui/button";

export function Hero () {
    return (
        <div className="w-full">
            <section className="h-[calc(100dvh-4rem)] flex justify-center items-center">
                <div className="flex flex-col gap-5 max-w-2xl ">
                    <h1 className="text-4xl md:text-6xl font-semibold text-center leading-14 md:leading-18">Building Digital Solutions That Matter</h1>
                    <p className="text-center">We specialize in web and mobile app development, creating innovative software solutions that drive business growth and digital transformation.</p>
                    <div className="flex flex-col md:flex-row gap-3 md:gap-5 mx-auto">
                        <Button size="lg">
                            <Link href={"/products"}>Explore Our Products</Link>
                        </Button>
                        <Button variant={"outline"} size="lg">
                            <Link href={"/contact"}>Get In Touch</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}