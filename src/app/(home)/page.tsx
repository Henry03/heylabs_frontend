import { AppSidebar } from "@/app/(home)/components/app-sidebar";
import { Hero } from "@/app/(home)/components/hero";
import { NavHome } from "@/app/(home)/components/nav-home";
import { ExpertiseCard } from "./components/expertise-card";
import { IconBolt, IconBrain, IconCode, IconDeviceMobile, IconWorld } from "@tabler/icons-react";
import { Clock, Code, Eye, Shield } from "lucide-react";
import { ProductCard } from "./components/product-card";
import cidrProductImage from "../../../public/cidr-product.jpg";
import ocrProductImage from "../../../public/ocr-product.jpg"
import { Footer } from "./components/footer";

const data = {
  expertise : [{
    icon: <IconCode/>,
    title: "Web Development",
    description: "Custom web applications built with modern technologies like React, Node.js, and cloud platforms for scalable solutions.",
    features: [
      "Responsive Design",
      "Progressive Web Apps",
      "E-commerce Solutions"
    ]
  },
  {
    icon: <IconDeviceMobile/>,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android with seamless user experiences.",
    features: [
      "iOS & Android Apps",
      "Cross-platform Solutions",
      "App Store Optimization"
    ]
  },
  {
    icon: <IconBrain/>,
    title: "AI & OCR Solutions",
    description: "Advanced AI-powered tools including OCR technology for document processing and data extraction.",
    features: [
      "ID Card OCR",
      "Document Processing",
      "Data Extraction"
    ]
  }],
  products : [{
    title: "ID Card OCR Scanner",
    description: "Advanced optical character recognition technology that accurately extracts information from ID cards, driver's licenses, and other identification documents.",
    image: "ocr-product.jpg",
    features: [{
      icon: <Shield size={18}/>,
      feature: "Secure login required for data protection"
    },{
      icon: <Eye size={18}/>,
      feature: "High accuracy OCR technology"
    },{
      icon: <Clock size={18}/>,
      feature: "Real-time processing"
    }],
    button: {
      text: "Learn More",
      path: "/product/ocr"
    }
  },{
    title: "IP to CIDR Converter",
    description: "A powerful networking tool that converts IP address ranges to CIDR notation, essential for network administrators and developers.",
    image: "ocr-product.jpg",
    imagePosition: "left",
    features: [{
      icon: <IconWorld size={18}/>,
      feature: "Publicly accessible tool"
    },{
      icon: <IconBolt size={18}/>,
      feature: "Instant conversion results"
    },{
      icon: <Code size={18}/>,
      feature: "Developer-friendly interface"
    }],
    button: {
      text: "Try It Now",
      path: "/product/cidr"
    }
  }]
}

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full px-5 md:px-5 max-w-7xl mx-auto">
        <NavHome/>
        <AppSidebar className="md:hidden"/>
        <Hero/>
        <section className="flex flex-col items-center gap-5">
            <h2 className="text-4xl font-semibold">
                Our Expertise
            </h2>
            <p className="max-w-2xl text-center">
                We deliver cutting-edge software solutions across web and mobile platforms, helping businesses transform their digital presence.
            </p>
            <div className="flex flex-col md:flex-row w-full gap-5 justify-center">
              {
                data.expertise.map((item, index) => 
                  <ExpertiseCard key={index} data={item}/>
                )
              }
            </div>
        </section>
        <section className="flex flex-col items-center gap-5 my-20">
          <h2 className="text-4xl font-semibold">
              Our Products
          </h2>
          <p className="max-w-2xl text-center">
              Innovative tools designed to solve real-world problems
          </p>
          <div className="flex flex-col justify-center gap-5">
            {
              data.products.map((item, index) => 
                <ProductCard key={index} data={item} imagePosition={item.imagePosition}/>
              )
            }
          </div>
        </section>
      </div>
      <Footer/>
    </div>
  );
}
