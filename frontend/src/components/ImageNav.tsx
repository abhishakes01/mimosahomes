import Link from "next/link";

export default function ImageNav() {
    const links = [
        { title: "Display Homes", image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1974&auto=format&fit=crop" },
        { title: "Facades", image: "/facades.jpg" },
        { title: "Virtual Tours", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" },
    ];

    return (
        <section>
            <div className="container-fluid mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    {links.map((link) => (
                        <div key={link.title} className="relative group overflow-hidden cursor-pointer h-[500px]">
                            <img
                                src={link.image}
                                alt={link.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                            <div className="absolute inset-0 flex flex-col justify-end p-10 pb-16">
                                <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md text-center">{link.title}</h3>
                                <div className="h-0.5 w-16 bg-white mx-auto mt-4 group-hover:w-32 transition-all duration-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
