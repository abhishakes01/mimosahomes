import { ArrowRight, Home, Map, Video, Layers } from "lucide-react";

const LINKS = [
    {
        title: "Display Homes",
        desc: "Visit displays across Melbourne's North, West, South East & Geelong",
        icon: Home,
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "Facades",
        desc: "Discover the perfect street appeal for your dream home",
        icon: Layers,
        color: "bg-purple-50 text-purple-600"
    },
    {
        title: "Virtual Tours",
        desc: "Step inside from anywhere—explore our immersive tours",
        icon: Video,
        color: "bg-green-50 text-green-600"
    },
    {
        title: "House & Land",
        desc: "Find your ideal lifestyle match with expertly curated packages",
        icon: Map,
        color: "bg-orange-50 text-orange-600"
    },
];

export default function QuickLinks() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                            <a key={link.title} href="#" className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl ${link.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-mimosa-dark mb-3 group-hover:text-mimosa-gold transition-colors flex items-center justify-between">
                                    {link.title}
                                    <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-mimosa-gold" />
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {link.desc}
                                </p>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
