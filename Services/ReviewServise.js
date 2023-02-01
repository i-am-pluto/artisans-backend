const Reviews = require("../Models/product/ReviewSchema");
const { getCustomerById } = require("../Repositories/CustomerRepository");
const { getProductById } = require("../Repositories/ProductRepository");
const { getUserById } = require("./UserService");

const getReviews = async (product_id, start, user_id) => {
  const product = await getProductById(product_id);
  const review_ids = product.reviews;
  const reviews = [];
  for (var i = 0; i < review_ids.length; i++) {
    reviews.push(await getReviewById(review_ids[i]));
  }
  reviews.sort((a, b) => {
    return b.upvotes - a.upvotes;
  });
  const result = [];
  for (var i = start * 5; i < start * 5 + 5 && i < reviews.length; i++) {
    const user = await getUserById(reviews[i].user_id);
    const id = reviews[i].id;
    const author = user.name.f_name + " " + user.name.l_name;
    const comment = reviews[i].comment;
    const pfp_image = user.pfp_url;
    const upvoted_by = reviews[i].upvoted_by;
    const upvotes = reviews[i].upvotes;
    result.push({ author, pfp_image, comment, upvoted_by, upvotes, id });
  }
  result.forEach((el, i) => {
    let isUpvoted = false;
    if (user_id) {
      if (
        el.upvoted_by.find((user) => {
          return user.equals(user_id);
        })
      )
        isUpvoted = true;
    }
    result[i].isUpvoted = isUpvoted;
  });
  return result;
};

const getReviewById = async (review_id) => {
  const review = await Reviews.findById(review_id);
  return review;
};

// upvote

// add
const addAReview = async (product_id, comment, user_id) => {
  const user = await getUserById(user_id);

  const review = new Reviews({
    comment: comment,
    user_id: user_id,
    author: user.name.f_name + " " + user.name.l_name,
    pfp_image: user.pfp_url,
  });

  const savedReview = await review.save();

  const product = await getProductById(product_id);
  product.reviews.push(savedReview.id);

  await product.save();

  return savedReview;
};

const upvoteAReview = async (user_id, review_id) => {
  const review = await getReviewById(review_id);

  if (
    review.upvoted_by.find((el) => {
      return el.equals(user_id);
    })
  )
    return;
  review.upvoted_by.push(user_id);
  review.upvotes = review.upvotes + 1;
  const savedReview = await review.save();
  return savedReview;
};
const downvoteAReview = async (user_id, review_id) => {
  const review = await getReviewById(review_id);

  if (
    !review.upvoted_by.find((el) => {
      el.equals(user_id);
    })
  )
    return;
  review.upvoted_by = review.upvoted_by.filter((el) => {
    return !el.equals(user_id);
  });
  review.upvotes = review.upvotes - 1;
  const savedReview = await review.save();
  return savedReview;
};

module.exports = {
  getReviewById,
  getReviews,
  addAReview,
  upvoteAReview,
  downvoteAReview,
};
