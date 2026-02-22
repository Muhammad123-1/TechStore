import { Link } from 'react-router-dom';

export default function BrandGrid({ brands = [] }) {
    /*
    Brands expected to be objects with at least: { _id, name, slug, image, productCount }
    Falls back to a placeholder if no image available.
    */

    return (
        <div className="brand-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {brands.map((brand, i) => (
                <Link
                    key={brand._id || i}
                    to={`/brand/${brand.slug || brand._id}`}
                    className="relative group overflow-hidden rounded-lg h-40 md:h-48 lg:h-56 block bg-dark-secondary/30 border border-gray-800 hover:scale-105 transform transition"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
backgroundImage: `url(${brand.image || brand.logo || 'https://placehold.co/800x600?text=' + encodeURIComponent(brand.name)})`
                        }}
                    />

                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                    <div className="absolute left-4 bottom-4 text-left text-white z-20">
                        <h3 className="font-bold text-lg drop-shadow">{brand.name}</h3>
                        <p className="text-xs text-white/80 mt-1">{brand.productCount ?? 0} products</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
