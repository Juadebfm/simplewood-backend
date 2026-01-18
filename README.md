# e-commerce-backend

## Models

Schemas or blueprints of how we want the data to be stored in the database

<!-- For example -->

```js
const User = {
  firstName: {
    required: true,
    dataType: "String",
  },
  lastName: {
    required: true,
    dataType: "String",
  },
  createdAt: {
    time: 12,
    date: Date().now,
  },
};
```

### TODO's FOR MODELS

- Code the schema.
- Set up useful functionalities
  - Hash password before it's saved in the local storage (signup)
  - Compare password at login.
  - Indexer (int)

_Client sends user data using fetch(req(juadeb2025)) ---> codebase (bcrypt) -> hashed/encrypted (dswicnskjscjsbj10) ---> database_

## Views

Routes by which we can target the values or data currently stored in the database

## Controllers

Functionalites that should run when we called to a routes `view` to get a particular data from `model` stored in the database.

```js
// frontend
const formData = {
  name: "juadeb",
  email: "test@test.com",
  password: "ejibcjwnkncss",
};

const url = "www.juadeb.com/register";

const reqObj = {
  method: "POST",
  body: JSON.stringify(formData),
};

fetch(url, reqObj)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error.message));
```

1. Infinity Scroll with sckeletal load
2. Normal Pagination (prev 1 2 3 4 next).

## Get all product alternate

```js
const getAllProducts = async (req, res) => {
  try {
    // Step 1: Get values from request (your destructuring made simple)
    let page = req.query.page;
    if (!page) page = 1;

    let limit = req.query.limit;
    if (!limit) limit = 12;

    let category = req.query.category;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    let inStock = req.query.inStock;

    let sortBy = req.query.sortBy;
    if (!sortBy) sortBy = "createdAt";

    let sortOrder = req.query.sortOrder;
    if (!sortOrder) sortOrder = "desc";

    let search = req.query.search;

    // Step 2: Start building filter
    let filter = {};
    filter.isActive = true;

    // Step 3: Add category if exists
    if (category) {
      filter.category = category;
    }

    // Step 4: Add price range (the part you marked as needing easier way)
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Step 5: Add stock filter
    if (inStock === "true") {
      filter.inStock = true;
      filter.stockQuantity = {};
      filter.stockQuantity.$gt = 0;
    }

    // Step 6: Add search filter
    if (search) {
      filter.$text = {};
      filter.$text.$search = search;
    }

    // Step 7: Calculate how many to skip (pagination math)
    let pageAsNumber = Number(page);
    let limitAsNumber = Number(limit);
    let skip = (pageAsNumber - 1) * limitAsNumber;

    // Step 8: Build sort object (the part you marked as needing easier way)
    let sort = {};
    if (sortOrder === "desc") {
      sort[sortBy] = -1;
    } else {
      sort[sortBy] = 1;
    }

    // Step 9: Get products from database
    let products = await Product.find(filter)
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitAsNumber);

    // Step 10: Count total products (THIS RUNS AFTER STEP 9 - SLOW!)
    let total = await Product.countDocuments(filter);

    // Step 11: Build response
    let currentPage = Number(page);
    let totalPages = Math.ceil(total / Number(limit));
    let hasNextPage = skip + products.length < total;
    let hasPrevPage = Number(page) > 1;

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: currentPage,
        totalPages: totalPages,
        totalProducts: total,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};
```
