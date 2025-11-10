import { Check, Code2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function ExpertiseCard () {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <Button size="icon-lg">
                    <Code2/>
                </Button>
                <CardTitle>Web Development</CardTitle>
                <CardDescription>
                    Custom web applications built with modern technologies like React, Node.js, and cloud platforms for scalable solutions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul>
                    <li className="flex items-center gap-2">
                        <Check size={16}/>
                        Responsive Design
                    </li>
                    <li>
                        <Check size={16}/>
                        Progressive Web Apps
                    </li>
                    <li>
                        <Check size={16}/>
                        E-commerce Solutions
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
}