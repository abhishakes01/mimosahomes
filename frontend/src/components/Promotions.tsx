export default function Promotions() {
    return (
        <section className="py-24 bg-mimosa-dark text-white relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-mimosa-gold/10 -skew-x-12 -translate-x-1/2 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <span className="inline-block py-1 px-3 bg-white/10 text-mimosa-gold border border-mimosa-gold/30 rounded-full text-sm font-bold tracking-wider mb-8 uppercase">
                    Latest News & Promotions
                </span>
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    A Better Tomorrow <br />
                    <span className="text-mimosa-gold">Starts Today</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Unlock savings on premium upgrades! Plus, get confidence that moves in with you with our <strong className="text-white">50 Year Structural Warranty</strong> on every home.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="px-10 py-4 bg-mimosa-gold text-white text-lg font-bold rounded-full hover:bg-yellow-600 transition-transform transform hover:scale-105 shadow-xl shadow-mimosa-gold/20">
                        View M Collection Offers
                    </button>
                    <button className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white hover:text-mimosa-dark transition-all">
                        View V Collection Offers
                    </button>
                </div>

                <p className="mt-8 text-sm text-gray-500">T&Cs apply. Limited time only.</p>
            </div>
        </section>
    );
}
