export default function CTABanner() {
    return (
        <section className="relative py-32 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop")' }}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="container mx-auto px-6 relative z-10 text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Begin Your Journey?</h2>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10">
                    Connect with one of our New Home Consultants today to explore your options, answer any questions, and take the next step toward your dream home.
                </p>
                <button className="bg-white text-mimosa-dark font-bold text-lg px-10 py-4 rounded-full hover:bg-mimosa-gold hover:text-white transition-all transform hover:scale-105 shadow-xl">
                    Get Started
                </button>
            </div>
        </section>
    );
}
