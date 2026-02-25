import Link from "next/link";
import { DollarSign, Star, ArrowRight } from "lucide-react";

export default function Collections() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 space-y-12">

                {/* V Collection - Card 1 */}
                <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-xl lg:h-[500px] border border-gray-100">
                    {/* Text Side */}
                    <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                                <DollarSign size={28} />
                            </div>
                            <span className="text-gray-600 font-bold tracking-wider uppercase text-sm">V Collection</span>
                        </div>

                        <h2 className="text-4xl font-bold text-mimosa-dark mb-4">Quality Meets Affordability</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                            The V Collection offers a range of stunning home designs that don't compromise on quality or style. Perfect for first home buyers.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-2 text-mimosa-dark font-medium">
                                <div className="w-2 h-2 bg-gray-400 rounded-full" /> Fixed Price Contracts
                            </div>
                            <div className="flex items-center gap-2 text-mimosa-dark font-medium">
                                <div className="w-2 h-2 bg-gray-400 rounded-full" /> 6-Star Energy Rating
                            </div>
                        </div>

                        <Link href="/new-home-designs?collections=v-collection" className="self-start px-8 py-4 border-2 border-mimosa-dark text-mimosa-dark font-bold rounded-full hover:bg-mimosa-dark hover:text-white transition-all flex items-center gap-2 group">
                            View V Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Image Side */}
                    <div className="lg:w-1/2 relative min-h-[300px] order-1 lg:order-2">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt="V Collection"
                        />
                    </div>
                </div>

                {/* M Collection - Card 2 */}
                <div className="flex flex-col lg:flex-row bg-[#003366] text-white rounded-3xl overflow-hidden shadow-xl lg:h-[500px]">
                    {/* Image Side */}
                    <div className="lg:w-1/2 relative min-h-[300px]">
                        <img
                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt="M Collection"
                        />
                    </div>

                    {/* Text Side */}
                    <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                                <Star size={28} />
                            </div>
                            <span className="text-white font-bold tracking-wider uppercase text-sm">M Collection</span>
                        </div>

                        <h2 className="text-4xl font-bold mb-4">More At No Extra Cost</h2>
                        <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                            Experience the difference with our M Collection. Featuring premium inclusions as standard, designed to impress with luxury finishes.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <div className="w-2 h-2 bg-mimosa-gold rounded-full" /> 40mm Stone Benchtops
                            </div>
                            <div className="flex items-center gap-2 text-white font-medium">
                                <div className="w-2 h-2 bg-mimosa-gold rounded-full" /> 2590mm Ceilings
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/new-home-designs?collections=m-collection" className="px-8 py-4 bg-white text-[#003366] font-bold rounded-full hover:bg-gray-100 transition-all text-center">
                                View M Collection
                            </Link>
                            <Link href="/m-collection/standard-inclusions" className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white hover:text-[#003366] transition-all text-center">
                                Inclusions
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
