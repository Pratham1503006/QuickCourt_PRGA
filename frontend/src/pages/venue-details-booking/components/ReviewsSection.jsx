import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ReviewsSection = ({ reviews, averageRating, totalReviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const reviewsPerPage = 5;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={14} className="text-warning fill-current" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      breakdown[Math.floor(review.rating)]++;
    });
    return breakdown;
  };

  const ratingBreakdown = getRatingBreakdown();

  const sortedReviews = [...reviews]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b?.rating - a?.rating;
      case 'lowest':
        return a?.rating - b?.rating;
      default:
        return 0;
    }
  });

  const paginatedReviews = sortedReviews?.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(sortedReviews?.length / reviewsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Reviews & Ratings</h2>
      {/* Rating Overview */}
      <div className="bg-muted rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-text-primary mb-2">
              {averageRating?.toFixed(1)}
            </div>
            <div className="flex items-center justify-center space-x-1 mb-2">
              {renderStars(averageRating)}
            </div>
            <div className="text-text-secondary">
              Based on {totalReviews} reviews
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1]?.map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{rating}</span>
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <div className="flex-1 bg-border rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{
                      width: `${totalReviews > 0 ? (ratingBreakdown?.[rating] / totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-text-secondary w-8">
                  {ratingBreakdown?.[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-text-primary">
          All Reviews ({sortedReviews?.length})
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="text-sm border border-border rounded-lg px-3 py-1 bg-card text-text-primary"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews?.map((review) => (
          <div key={review?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Image
                src={review?.userAvatar}
                alt={review?.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-text-primary">{review?.userName}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {formatDate(review?.date)}
                      </span>
                    </div>
                  </div>
                  {review?.isVerified && (
                    <div className="flex items-center space-x-1 text-success">
                      <Icon name="CheckCircle" size={16} />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-text-secondary leading-relaxed mb-3">
                  {review?.comment}
                </p>
                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review?.images?.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review?.helpfulCount})</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                    <Icon name="MessageCircle" size={14} />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;