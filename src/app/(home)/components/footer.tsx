export function Footer () {
    return (
        <div className="w-full bg-primary">
            <div className="px-5 py-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-7xl mx-auto text-primary-foreground gap-5">
                <div className="flex flex-col gap-3">
                    <div className="text-2xl font-semibold">HeyaLabs</div>
                    <p>Building innovative software solutions for the digital age.</p>
                </div>
                <div className="flex flex-col  gap-3">
                    <div className="text-xl font-semibold">Services</div>
                    <div>
                        <div>Web Development</div>
                        <div>Mobile Apps</div>
                        <div>AI Solutions</div>
                        <div>OCR Technology</div>
                    </div>
                </div>
                <div className="flex flex-col  gap-3">
                    <div className="text-xl font-semibold">Products</div>
                    <div>
                        <div>ID Card OCR</div>
                        <div>IP to CIDR Converter</div>
                    </div>
                </div>
                <div className="flex flex-col  gap-3">
                    <div className="text-xl font-semibold">Contact</div>
                    <div>
                        <div>henryyanggg@gmail.com</div>
                        <div>Jakarta Pusat, DKI Jakarta</div>
                    </div>
                </div>
            </div>
        </div>
    )
}