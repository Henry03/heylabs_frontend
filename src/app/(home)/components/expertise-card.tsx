import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { JSX } from "react";
import { IconType } from "recharts/types/component/DefaultLegendContent";

export function ExpertiseCard ({
    data,
}: {
    data : {
        icon: JSX.Element,
        title: string,
        description: string,
        features: string[]
    }
}) {
    return (
        <Card className="lg:min-w-2xs md:max-w-md">
            <CardHeader>
                <Button size="icon-lg">
                    {data.icon}
                </Button>
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul>
                    {
                        data.features.map((feature, index) => 
                            <li key={index} className="flex items-center gap-2">
                                <Check size={16}/>
                                {feature}
                            </li>
                        )
                    }
                </ul>
            </CardContent>
        </Card>
    )
}