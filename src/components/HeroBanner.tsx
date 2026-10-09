import React from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  vid: string;
  tag: string;
  title: string;
  sub: string;
  bg: string;
}

interface HeroBannerProps {
  slides: Slide[];
  slide: number;
  setSlide: React.Dispatch<React.SetStateAction<number>>;
  onShopClick?: () => void;
}

export function HeroBanner({ slides, slide, setSlide, onShopClick }: HeroBannerProps) {
  const currentSlide = slides[slide] ?? slides[0]!;

  return (
    <section className="relative min-h-[600px] h-[85vh] w-full overflow-hidden bg-black flex flex-col justify-end">
      {/* Video Background */}
      <video
        key={currentSlide.vid + slide}
        src={currentSlide.vid}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-700"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 pb-24 pt-32 text-white">
        <div key={slide} className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="pill mb-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white border border-white/30">
            <Sparkles className="h-3.5 w-3.5 text-kiwi" />
            {currentSlide.tag}
          </span>
          <h1 className="text-5xl font-medium leading-[1.05] md:text-7xl lg:text-8xl tracking-tight">
            {currentSlide.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 font-light max-w-xl leading-relaxed">
            {currentSlide.sub}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#shop"
              onClick={onShopClick}
              className="pill bg-white px-10 py-4 font-semibold text-black transition hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Shop Now
            </a>
            <a
              href="#new-arrivals"
              className="pill bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 font-semibold text-white transition hover:bg-white/20"
            >
              Discover More
            </a>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-[4.5rem] right-4 md:right-8 z-20 flex gap-3">
        <button
          aria-label="Previous Slide"
          onClick={() => setSlide((slide + slides.length - 1) % slides.length)}
          className="pill bg-white/20 backdrop-blur-md p-3 text-white border border-white/20 transition hover:bg-white/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next Slide"
          onClick={() => setSlide((slide + 1) % slides.length)}
          className="pill bg-white/20 backdrop-blur-md p-3 text-white border border-white/20 transition hover:bg-white/40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slide Progress Indicator Dots */}
      <div className="absolute bottom-[5.5rem] left-4 md:left-8 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setSlide(i)}
            className={`pill h-1.5 transition-all ${i === slide ? "w-8 bg-white" : "w-3 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
