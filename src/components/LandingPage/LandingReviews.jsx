import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

export default function LandingReviews() {
    const reviews = [
        {
            id: 1,
            content: "The easiest and most reliable booking platform I've ever used. The sea view villa we booked in Greece was exactly as pictured, and the 24/7 concierge was incredibly helpful during our stay.",
            author: "Sarah Jenkins",
            role: "Frequent Traveler",
            image: "/images/user/user-01.jpg",
            rating: 5,
        },
        {
            id: 2,
            content: "I manage corporate retreats and this platform is my go-to. Their curated selection of luxury properties guarantees a premium experience every single time with zero hidden fees.",
            author: "David Chen",
            role: "Corporate Planner",
            image: "/images/user/user-02.jpg",
            rating: 5,
        },
        {
            id: 3,
            content: "We booked our honeymoon cabin through Out App and it was pure magic. Instant confirmation gave us peace of mind, and the property itself exceeded all our expectations.",
            author: "Elena Rodriguez",
            role: "Honeymooner",
            image: "/images/user/user-03.jpg",
            rating: 5,
        },
        {
            id: 4,
            content: "Outstanding customer service and an amazing selection of exclusive properties. The app's interface is sleek and finding exactly what we wanted took mere minutes.",
            author: "Michael Ross",
            role: "Family Vacationer",
            image: "/images/user/user-04.jpg",
            rating: 5,
        },
        {
            id: 5,
            content: "The amenities listed were 100% accurate. We loved the smooth check-in process and the fact that we could apply digital coupons directly at checkout. Highly recommended!",
            author: "Jessica Williams",
            role: "Digital Nomad",
            image: "/images/user/user-05.jpg",
            rating: 5,
        }
    ];

    return (
        <section id="reviews" className="py-12 lg:py-16 bg-white dark:bg-gray-950 dark:border-gray-900 border-t border-gray-150/40 dark:border-gray-800/60 overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-5">
                        Customer Feedback
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 dark:text-white leading-tight tracking-tight">
                        Don't just take our word for it.
                    </h3>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base dark:text-gray-400 font-medium leading-relaxed">
                        Hear from our community of travelers who have experienced the difference of booking with our platform.
                    </p>
                </div>

                <div className="relative cursor-grab active:cursor-grabbing overflow-visible">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={32}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            bulletActiveClass: 'bg-brand-600 scale-120 opacity-100',
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-16"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id} className="h-auto">
                                {/* Glassmorphic Testimonial Card */}
                                <div className="relative bg-gray-50/50 rounded-[32px] p-8 border border-gray-250/50 hover:border-brand-600/20 shadow-[0_12px_35px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(70,95,255,0.02)] transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1.5 dark:bg-gray-900/60 dark:border-gray-800/40">
                                    
                                    {/* Quote watermark */}
                                    <Quote size={32} className="absolute top-6 right-6 text-gray-250/60 dark:text-gray-800/30 pointer-events-none" />

                                    {/* Gilded stars capsule */}
                                    <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl w-fit mb-6 text-amber-600 dark:text-amber-400">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} size={13} fill="currentColor" />
                                        ))}
                                    </div>

                                    {/* Content text */}
                                    <p className="text-gray-600 mb-8 font-medium text-xs sm:text-sm leading-relaxed flex-grow dark:text-gray-300">
                                        "{review.content}"
                                    </p>

                                    {/* Author Profile */}
                                    <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-gray-150/50 dark:border-gray-850/40">
                                        <img 
                                            src={review.image} 
                                            alt={review.author} 
                                            className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-800" 
                                        />
                                        <div>
                                            <h4 className="text-gray-900 font-extrabold text-sm dark:text-white leading-none mb-1">
                                                {review.author}
                                            </h4>
                                            <p className="text-gray-500 text-[10px] dark:text-gray-400 font-black uppercase tracking-wider">
                                                {review.role}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
