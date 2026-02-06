import { Award, CheckCircle, Clock, Heart } from "lucide-react";

const FEATURES = [
    {
        icon: Award,
        title: "Award Winning Designs",
        description: " Recognized for excellence in architectural innovation and functional living spaces."
    },
    {
        icon: CheckCircle,
        title: "Quality Assurance",
        description: "Rigorous 200-point quality check at every stage of construction."
    },
    {
        icon: Clock,
        title: "On-Time Guarantee",
        description: "We guarantee your completion date so you can plan your move with confidence."
    },
    {
        icon: Heart,
        title: "Customer Obsessed",
        description: "Dedicated support team to guide you through every step of the building journey."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-mimosa-gold font-semibold tracking-wider uppercase text-sm mb-3 block">The Difference</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-mimosa-dark">Why Build With Mimosa?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="text-center group p-6 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-mimosa-gold/10 rounded-full flex items-center justify-center text-mimosa-gold mb-6 group-hover:bg-mimosa-gold group-hover:text-white transition-all duration-300">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-mimosa-dark mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
