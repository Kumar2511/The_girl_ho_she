import  api from "@/lib/api";

export const reviewsService = {
  // ======================================
  // Get approved reviews for one product
  // ======================================
  getProductReviews: (productId: string) =>
    api.get(`/reviews/product/${productId}`),
};