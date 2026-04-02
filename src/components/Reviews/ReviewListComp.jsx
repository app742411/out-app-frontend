import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import { getReviews, softDeleteReview } from "../../api/authApi";
import { Star, Trash2 } from "lucide-react";

export default function ReviewListComp({ type, id }) {
    const [reviewsData, setReviewsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 5;

    const baseURL = import.meta.env.VITE_API_URL || "";
    const baseImgUrl = baseURL.replace(/\/$/, "");

    const fetchReviews = async (pageNum) => {
        try {
            setLoading(true);
            const res = await getReviews(type, id, pageNum, limit);
            if (res.success) {
                setReviewsData(res);
            } else {
                toast.error(res.message || "Failed to fetch reviews");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred fetching reviews");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && type) {
            fetchReviews(page);
        }
    }, [id, type, page]);

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        
        try {
            setDeletingId(reviewId);
            const res = await softDeleteReview(reviewId);
            if (res.success) {
                toast.success("Review deleted successfully");
                fetchReviews(page);
            } else {
                toast.error(res.message || "Failed to delete review");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while deleting the review");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && !reviewsData) {
        return <div className="p-6 text-center text-gray-500">Loading reviews...</div>;
    }

    if (!reviewsData || !reviewsData.data || reviewsData.data.length === 0) {
        return (
            <ComponentCard title="Reviews & Ratings">
                <div className="text-center p-8 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                    No reviews available yet.
                </div>
            </ComponentCard>
        );
    }

    return (
        <ComponentCard title="Reviews & Ratings">
            <div className="space-y-8">
                {/* Summary Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-8 p-6 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-auto">
                        <span className="text-5xl font-black text-gray-900 dark:text-white">
                            {Number(reviewsData.avgRating).toFixed(1)}
                        </span>
                        <div className="flex text-yellow-500 my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                star <= Math.round(reviewsData.avgRating) 
                                    ? <Star key={star} className="w-5 h-5 fill-current" /> 
                                    : <Star key={star} className="w-5 h-5 text-gray-300" />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            Based on {reviewsData.totalReviews} reviews
                        </span>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviewsData.breakdown[rating] || 0;
                            const percentage = reviewsData.totalReviews > 0 ? (count / reviewsData.totalReviews) * 100 : 0;
                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-12 flex items-center gap-1">
                                        {rating} <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-500 rounded-full" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 w-8 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviewsData.data.map((review) => (
                        <div key={review._id} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold uppercase">
                                        {review.reviewer?.firstName?.charAt(0)}{review.reviewer?.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                                            {review.reviewer?.firstName} {review.reviewer?.lastName}
                                        </h4>
                                        <span className="text-xs text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex gap-1 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            star <= review.rating 
                                                ? <Star key={star} className="w-4 h-4 fill-current" /> 
                                                : <Star key={star} className="w-4 h-4 text-gray-300" />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        disabled={deletingId === review._id}
                                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 flex items-center gap-1"
                                        title="Delete Review"
                                    >
                                        {deletingId === review._id ? (
                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                {review.comment}
                            </p>

                            {review.photos && review.photos.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {review.photos.map((photo) => (
                                        <div key={photo._id} className="relative group min-w-[100px] h-[100px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={`${baseImgUrl}/${photo.url}`}
                                                alt={photo.caption || "Review photo"}
                                                className="w-full h-full object-cover"
                                            />
                                            {photo.caption && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[10px] text-white text-center truncate px-1">
                                                        {photo.caption}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {reviewsData.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-500">
                            Page {page} of {reviewsData.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === reviewsData.totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </ComponentCard>
    );
}
