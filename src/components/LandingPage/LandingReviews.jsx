import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
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
        <section id="reviews" className="py-24 bg-gray-50 dark:bg-gray-900 dark:border-gray-800 border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand-500 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">Customer Feedback</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">Don't just take our word for it.</h3>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg dark:text-gray-400">Hear from our community of travelers who have experienced the difference of booking with our platform.</p>
                </div>

                <div className="relative cursor-grab active:cursor-grabbing">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={32}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            bulletActiveClass: 'bg-brand-500',
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
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex gap-1 text-yellow-400 mb-6">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-8 italic leading-relaxed flex-grow dark:text-gray-300">"{review.content}"</p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <img src={review.image} alt={review.author} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                                        <div>
                                            <h4 className="text-gray-900 font-bold text-sm dark:text-white">{review.author}</h4>
                                            <p className="text-gray-500 text-xs dark:text-gray-400">{review.role}</p>
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
