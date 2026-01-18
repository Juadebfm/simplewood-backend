const Address = require("../models/Address.models");
const CompareItem = require("../models/CompareItem.models");
const NewsletterSubscription = require("../models/NewsletterSubscription.models");
const Order = require("../models/Order.models");
const Review = require("../models/Review.models");
const WishlistItem = require("../models/WishlistItem.models");

const toProductSummary = (product) => {
  if (!product) return null;

  const image = product.images?.[0];
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    image: image?.url || null,
    imageAlt: image?.alt || product.name,
  };
};

const getDashboardOverview = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const [
      newsletter,
      addresses,
      orders,
      wishlistItems,
      compareItems,
      reviewCount,
    ] = await Promise.all([
      NewsletterSubscription.findOne({
        email: user.email,
        isActive: true,
      }).lean(),
      Address.find({ user: userId })
        .sort({ isDefault: -1, createdAt: -1 })
        .lean(),
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      WishlistItem.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("product", "name price images")
        .lean(),
      CompareItem.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("product", "name price images")
        .lean(),
      Review.countDocuments({ user: userId }),
    ]);

    const addressBook = addresses.map((address) => ({
      id: address._id,
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    }));

    const recentOrders = orders.map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      shipTo: order.shippingAddress?.fullName || user.name,
      total: order.total,
      status: order.status,
      currency: order.currency,
    }));

    const recentlyOrderedMap = new Map();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = String(item.product || item.name);
        if (!recentlyOrderedMap.has(key)) {
          recentlyOrderedMap.set(key, {
            productId: item.product || null,
            name: item.name,
            price: item.price,
            image: item.image?.url || null,
            imageAlt: item.image?.alt || item.name,
            orderedAt: order.createdAt,
          });
        }
      });
    });

    const recentlyOrdered = Array.from(recentlyOrderedMap.values()).slice(0, 6);

    const wishlist = wishlistItems
      .map((item) => ({
        id: item._id,
        addedAt: item.createdAt,
        product: toProductSummary(item.product),
      }))
      .filter((item) => item.product);

    const compareList = compareItems
      .map((item) => ({
        id: item._id,
        addedAt: item.createdAt,
        product: toProductSummary(item.product),
      }))
      .filter((item) => item.product);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        newsletter: {
          subscribed: Boolean(newsletter),
          email: newsletter?.email || user.email,
        },
        addressBook,
        recentOrders,
        wishlist,
        compareList,
        recentlyOrdered,
        reviewSummary: {
          count: reviewCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard overview",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardOverview,
};
