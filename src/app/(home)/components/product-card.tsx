import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import { IconType } from "recharts/types/component/DefaultLegendContent";

export function ProductCard ({
    data,
    imagePosition = "right"
}: {
    data : {
        title: string,
        description: string,
        features: {
            icon: JSX.Element,
            feature: string
        }[],
        image: string,
        button: {
            text: string,
            path: string
        }
    },
    imagePosition?: string
}) {
    const isImageLeft = imagePosition === "left";

    return (
        <div className="grid md:grid-cols-2 max-w-5xl gap-5 items-center">
            <div
                className={`
                order-1
                ${isImageLeft ? "md:order-1" : "md:order-2"}
                `}
            >
                <Image
                className="rounded-2xl w-full object-cover"
                src={`/${data.image}`}
                width={1000}
                height={1000}
                alt={`${data.title} Image`}
                />
            </div>

            <div
                className={`
                order-2
                ${isImageLeft ? "md:order-2" : "md:order-1"}
                flex flex-col gap-5
                `}
            >
                <h3 className="font-semibold text-2xl">{data.title}</h3>
                <p>{data.description}</p>
                <ul className="flex flex-col gap-3">
                {data.features.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                    {item.icon}
                    {item.feature}
                    </li>
                ))}
                </ul>
                <Button className="w-fit">
                <Link href={data.button.path}>{data.button.text}</Link>
                </Button>
            </div>
        </div>
    )
}