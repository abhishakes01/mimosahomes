import { MapPin } from "lucide-react";

export default function HouseLand() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=2070&auto=format&fit=crop"
                                alt="House and Land Packages"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <p className="text-lg font-medium opacity-90 mb-1">Featured Estate</p>
                                    <h3 className="text-3xl font-bold">Minta Estate, Berwick</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <span className="text-mimosa-gold font-semibold tracking-wider uppercase text-sm mb-4 block">House & Land</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-mimosa-dark mb-6">The Perfect Package For You</h2>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            We partner with Melbourne’s leading land developers to bring you exclusive House & Land packages in the most sought-after estates. Simplify your journey with our fixed-price solutions.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                            {[
                                "Fixed Price Contracts",
                                "Turnkey Inclusions",
                                "Premium locations",
                                "Expert Siting"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-mimosa-gold" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-mimosa-dark text-white rounded-lg font-semibold hover:bg-black transition-colors">
                                View All Packages
                            </button>
                            <button className="px-8 py-4 border border-gray-300 text-mimosa-dark rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                                Find an Estate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
