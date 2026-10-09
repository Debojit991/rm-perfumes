import React, { useRef, useState, useEffect } from "react";
import { Star, Heart, ShoppingBag, Sparkles } from "lucide-react";

/**
 * Product Data Interface
 */
export interface Product {
  id: number;
  name: string;
  notes: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  badge?: "Bestseller" | "Sale" | "New";
  category: "EDP" | "Attar" | "Gifting";
  accentColor: string;
}

export const BESTSELLER_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kiwi Crush",
    notes: "Kiwi · Lime · Green tea",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    price: 1299,
    rating: 4.8,
    reviews: 412,
    badge: "Bestseller",
    category: "EDP",
    accentColor: "from-lime-100 to-emerald-200",
  },
  {
    id: 2,
    name: "Watermelon Berry",
    notes: "Watermelon · Strawberry · Musk",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    price: 1099,
    originalPrice: 1499,
    discount: "-27%",
    rating: 4.7,
    reviews: 289,
    badge: "Sale",
    category: "EDP",
    accentColor: "from-pink-100 to-rose-200",
  },
  {
    id: 3,
    name: "Peach Please",
    notes: "Peach · Apricot · Neroli",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    price: 1199,
    rating: 4.9,
    reviews: 530,
    badge: "Bestseller",
    category: "EDP",
    accentColor: "from-amber-100 to-orange-200",
  },
  {
    id: 4,
    name: "Ambre Caramel",
    notes: "Vanilla · Caramel · Cocoa",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    price: 899,
    originalPrice: 1199,
    discount: "-25%",
    rating: 4.6,
    reviews: 174,
    badge: "Sale",
    category: "Attar",
    accentColor: "from-amber-50 to-yellow-100",
  },
];

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

interface Bestsellers3DParallaxProps {
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: number) => void;
}

/**
 * 3D Card Item with Parallax Scroll & Micro-Interactions
 */
function ParallaxProductCard({
  product,
  index,
  scrollProgress,
  onAddToCart,
  onToggleWishlist,
}: {
  product: Product;
  index: number;
  scrollProgress: number; // 0 (out of view) -> 0.5 (center) -> 1 (scrolled past)
  onAddToCart?: ((p: Product) => void) | undefined;
  onToggleWishlist?: ((id: number) => void) | undefined;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Staggered calculation based on card index (0.12s staggered offset per card)
  // Cards enter smoothly from left to right as the section scrolls into view
  const staggerOffset = index * 0.08;
  const clampedProgress = Math.min(Math.max((scrollProgress - staggerOffset) / (1 - staggerOffset), 0), 1);

  // Entrance / Pop-Out math:
  // Starts scaled down (0.82) and pushed deep in 3D space (translateZ: -60px, rotateX: 14deg)
  // At center view (0.5), settles at scale: 1, translateZ: 0, rotateX: 0
  // When scrolling past (0.8 -> 1.0), softly recedes back (scale: 0.88, translateZ: -40px)
  let scale = 0.82;
  let opacity = 0;
  let translateZ = -60;
  let rotateX = 14;
  let translateY = 50;

  if (clampedProgress <= 0.45) {
    // Entrance phase (Scroll into view)
    const t = clampedProgress / 0.45; // 0 -> 1
    // Smooth ease-out curve
    const ease = 1 - Math.pow(1 - t, 3);
    opacity = ease;
    scale = 0.82 + ease * 0.18;
    translateZ = -60 + ease * 60;
    rotateX = 14 * (1 - ease);
    translateY = 50 * (1 - ease) + (index % 2 === 0 ? -10 : 10) * ease; // subtle floating stagger
  } else if (clampedProgress <= 0.65) {
    // Resting focus window
    opacity = 1;
    scale = 1;
    translateZ = 0;
    rotateX = 0;
    // Differential floating vertical parallax
    const floatRatio = (clampedProgress - 0.45) / 0.2;
    translateY = (index % 2 === 0 ? -12 : 12) + (floatRatio - 0.5) * (index === 0 || index === 3 ? 18 : -14);
  } else {
    // Exit phase (Scrolling past upwards)
    const t = (clampedProgress - 0.65) / 0.35; // 0 -> 1
    const ease = t * t;
    opacity = Math.max(1 - ease * 1.2, 0);
    scale = 1 - ease * 0.15;
    translateZ = -ease * 50;
    rotateX = -ease * 12;
    translateY = -ease * 60;
  }

  // Interactive 3D Card Hover / Mouse Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="perspective-[1200px] w-full"
      style={{ willChange: "transform, opacity" }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group relative flex flex-col rounded-[2rem] bg-white p-3.5 shadow-sm transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-stone-900/5 select-none"
        style={{
          transformStyle: "preserve-3d",
          opacity: opacity,
          transform: `
            translateY(${translateY}px)
            translateZ(${translateZ}px)
            scale(${isHovered ? scale * 1.02 : scale})
            rotateX(${rotateX + (isHovered ? mouseTilt.y : 0)}deg)
            rotateY(${isHovered ? mouseTilt.x : 0}deg)
          `,
          transition: isHovered
            ? "transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease"
            : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Product Image Area with Dynamic Accent Background */}
        <div
          className={`relative aspect-square w-full overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${product.accentColor}`}
          style={{ transform: "translateZ(25px)" }}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute left-3.5 top-3.5" style={{ transform: "translateZ(35px)" }}>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide shadow-sm text-white ${
                  product.badge === "Bestseller"
                    ? "bg-[#ff3366]"
                    : product.badge === "Sale"
                    ? "bg-[#ff4d36]"
                    : "bg-[#2563eb]"
                }`}
              >
                {product.badge === "Bestseller" && <Sparkles className="h-3 w-3" />}
                {product.badge}
              </span>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            type="button"
            aria-label={`Save ${product.name} to wishlist`}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
              onToggleWishlist?.(product.id);
            }}
            className="absolute right-3.5 top-3.5 rounded-full bg-white/90 p-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-115 hover:bg-white active:scale-95"
            style={{ transform: "translateZ(40px)" }}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-[#ff3366] text-[#ff3366]" : "text-stone-700"
              }`}
            />
          </button>
        </div>

        {/* Product Meta & Details */}
        <div
          className="flex flex-1 flex-col px-2.5 pb-1 pt-4"
          style={{ transform: "translateZ(15px)" }}
        >
          {/* Category Tag */}
          <span className="w-fit rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[11px] font-semibold text-[#166534]">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="mt-2 text-xl font-medium tracking-tight text-stone-900 font-serif">
            {product.name}
          </h3>

          {/* Fragrance Notes */}
          <p className="mt-0.5 text-xs text-stone-500 font-sans tracking-wide">
            {product.notes}
          </p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-800">
            <Star className="h-3.5 w-3.5 fill-stone-900 text-stone-900" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-stone-400">({product.reviews})</span>
          </div>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-stone-900">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-stone-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-[#ef4444]">
                  {product.discount}
                </span>
              </>
            )}
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#c7f284] py-3 text-sm font-semibold text-stone-900 shadow-sm transition-all duration-300 hover:bg-[#b8e86c] hover:shadow-md active:scale-[0.98]"
            style={{ transform: "translateZ(25px)" }}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main "The Bestsellers" 3D Scroll Parallax Section
 */
export default function Bestsellers3DParallax({
  products = BESTSELLER_PRODUCTS,
  onAddToCart,
  onToggleWishlist,
}: Bestsellers3DParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener computing normalized viewport progress (0 to 1)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Start calculating when the section enters bottom of viewport (top <= windowHeight)
      // and completes when section leaves top of viewport (bottom <= 0)
      const totalDistance = windowHeight + rect.height;
      const currentScroll = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentScroll / totalDistance, 0), 1);

      setScrollProgress(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bestsellers-3d"
      className="relative overflow-hidden bg-[#FAF7F2] py-20 md:py-28"
      aria-label="The Bestsellers Collection"
    >
      {/* Subtle ambient 3D lighting glow in background */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-lime-200/20 via-pink-200/20 to-orange-200/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight font-serif">
            The <span className="italic font-normal">Bestsellers</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-500 max-w-md mx-auto font-sans">
            Handcrafted fruit extractions and artisanal scents designed to turn heads.
          </p>
        </div>

        {/* 3D Product Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {products.slice(0, 4).map((product, index) => (
            <ParallaxProductCard
              key={product.id}
              product={product}
              index={index}
              scrollProgress={scrollProgress}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-16 flex justify-center">
          <a
            href="#shop"
            className="group inline-flex items-center gap-2 border-b-2 border-stone-900 pb-1 text-sm font-semibold tracking-wider text-stone-900 transition-colors hover:border-[#ff3366] hover:text-[#ff3366]"
          >
            VIEW ALL BESTSELLERS
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
