import { Star, CheckCircle } from "lucide-react";

const REVIEWS = [
    {
        title: "Great experience so far",
        content: "We have recently started our build with Mitra Homes. My partner and I have been dealing with the sales team who have been absolutely amazing. They have gone above and beyond to help us get our dream home started.",
        author: "Rachael & Daniel",
        location: "Melbourne, VIC"
    },
    {
        title: "First Home Buyer Support",
        content: "Being a first home buyer, I was very nervous about the whole process. Mitra Homes have been fantastic in guiding me through every step. The fixed price contract gave me huge peace of mind.",
        author: "Christopher S.",
        location: "Tarneit, VIC"
    },
    {
        title: "Professional and Quality",
        content: "Sales consultant was very helpful and informative. He helped us to choose the right floor plan to suit our block. The quality of the display homes was what originally sold us.",
        author: "Sandeep K.",
        location: "Craigieburn, VIC"
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-mimosa-dark mb-6 tracking-tight">What Our Customers Have to Say</h2>

                    <div className="inline-flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 text-mimosa-dark font-bold text-lg mb-2">
                            <span className="text-[#48bb78] text-4xl font-extrabold">4.8</span>
                            <div className="flex flex-col items-start">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="#48bb78" stroke="none" size={24} />)}
                                </div>
                                <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">based on 324 reviews</span>
                            </div>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/ProductReview.com.au_logo.png" alt="ProductReview" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" />
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {REVIEWS.map((review, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative flex flex-col">
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="#48bb78" stroke="none" size={18} />)}
                            </div>

                            <h3 className="font-bold text-lg text-mimosa-dark mb-3">{review.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                                "{review.content}"
                            </p>

                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div>
                                    <span className="block font-bold text-gray-900 text-sm">{review.author}</span>
                                    <span className="block text-gray-400 text-xs">{review.location}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-[#48bb78] font-bold uppercase tracking-wider bg-green-50 px-2 py-1 rounded">
                                    <CheckCircle size={12} /> Verified
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a href="#" className="inline-flex items-center gap-2 text-gray-500 hover:text-mimosa-dark transition-colors font-medium border-b border-transparent hover:border-mimosa-dark pb-0.5">
                        Read all reviews on ProductReview.com.au
                    </a>
                </div>

            </div>
        </section>
    );
}
