import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "ya-basa-secret-key";

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// =====================================================
// HELPERS
// =====================================================

const VALID_ORDER_TYPES = [
  "DELIVERY",
  "TAKEAWAY",
];

const VALID_ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "READY_FOR_PICKUP",
  "PICKED_UP",
  "CANCELLED",
];

const VALID_RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

function formatMenuItem(item) {
  if (!item) {
    return null;
  }

  return {
    ...item,
    price: Number(item.price),
  };
}

function formatPayment(payment) {
  if (!payment) {
    return null;
  }

  return {
    ...payment,
    amount: Number(payment.amount),
  };
}

function formatOrder(order) {
  if (!order) {
    return null;
  }

  return {
    ...order,

    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    deliveryCharge: Number(
      order.deliveryCharge
    ),
    discount: Number(order.discount),
    total: Number(order.total),

    payment: formatPayment(
      order.payment
    ),

    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          ...item,

          unitPrice: Number(
            item.unitPrice
          ),

          menuItem: formatMenuItem(
            item.menuItem
          ),
        }))
      : [],
  };
}

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "Ya Basa Restaurant Backend is running!",
    status: "OK",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        success: true,
        status: "healthy",
        database: "connected",
        phone: "7058485934",
      });
    } catch (error) {
      console.error(
        "Health check error:",
        error
      );

      res.status(500).json({
        success: false,
        status: "unhealthy",
        database: "disconnected",
      });
    }
  }
);

// =====================================================
// PUBLIC MENU
// =====================================================

app.get(
  "/api/menu",
  async (req, res) => {
    try {
      const menu =
        await prisma.menuItem.findMany({
          where: {
            isAvailable: true,
          },

          include: {
            category: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json({
        success: true,
        data: menu.map(
          formatMenuItem
        ),
      });
    } catch (error) {
      console.error(
        "Get menu error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch menu",
      });
    }
  }
);

// =====================================================
// PUBLIC SINGLE MENU ITEM
// =====================================================

app.get(
  "/api/menu/:id",
  async (req, res) => {
    try {
      const item =
        await prisma.menuItem.findUnique({
          where: {
            id: req.params.id,
          },

          include: {
            category: true,
          },
        });

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Menu item not found",
        });
      }

      res.json({
        success: true,
        data: formatMenuItem(item),
      });
    } catch (error) {
      console.error(
        "Get menu item error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch menu item",
      });
    }
  }
);

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

function auth(req, res, next) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
}

// =====================================================
// ADMIN AUTH
// =====================================================

function adminAuth(
  req,
  res,
  next
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Admin login required",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    if (
      decoded.role !== "ADMIN" &&
      decoded.role !== "STAFF"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Admin access denied",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired admin token",
    });
  }
}

// =====================================================
// REGISTER
// =====================================================

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Name, email and password are required",
          });
      }

      if (
        String(password).length < 6
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Password must be at least 6 characters",
          });
      }

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email:
              normalizedEmail,
          },
        });

      if (existingUser) {
        return res
          .status(409)
          .json({
            success: false,
            message:
              "Email already registered",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await prisma.user.create({
          data: {
            name: String(
              name
            ).trim(),

            email:
              normalizedEmail,

            passwordHash:
              hashedPassword,

            phone: phone
              ? String(
                  phone
                ).trim()
              : null,
          },
        });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(201).json({
        success: true,
        message:
          "Registration successful",
        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Registration failed",
      });
    }
  }
);

// =====================================================
// LOGIN
// =====================================================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Email and password are required",
          });
      }

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const user =
        await prisma.user.findUnique({
          where: {
            email:
              normalizedEmail,
          },
        });

      if (!user) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password",
          });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.passwordHash
        );

      if (!passwordMatch) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Invalid email or password",
          });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        success: true,
        message:
          "Login successful",
        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Login failed",
      });
    }
  }
);

// =====================================================
// ADMIN - GET MENU
// =====================================================

app.get(
  "/api/admin/menu",
  adminAuth,
  async (req, res) => {
    try {
      const menu =
        await prisma.menuItem.findMany({
          include: {
            category: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json({
        success: true,
        data: menu.map(
          formatMenuItem
        ),
      });
    } catch (error) {
      console.error(
        "Admin get menu error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch admin menu",
      });
    }
  }
);

// =====================================================
// ADMIN - ADD MENU ITEM
// =====================================================

app.post(
  "/api/admin/menu",
  adminAuth,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        imageUrl,
        isVeg,
        isSpicy,
        isBestseller,
        isAvailable,
        categoryId,
      } = req.body;

      if (
        !name ||
        !String(name).trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Dish name is required",
          });
      }

      if (
        price === undefined ||
        price === null ||
        Number.isNaN(
          Number(price)
        ) ||
        Number(price) < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Valid price is required",
          });
      }

      if (!categoryId) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Category is required",
          });
      }

      const category =
        await prisma.menuCategory.findUnique(
          {
            where: {
              id: categoryId,
            },
          }
        );

      if (!category) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Selected category does not exist",
          });
      }

      const item =
        await prisma.menuItem.create({
          data: {
            name: String(
              name
            ).trim(),

            description:
              description != null
                ? String(
                    description
                  )
                : "",

            price:
              Number(price),

            imageUrl:
              imageUrl != null
                ? String(
                    imageUrl
                  )
                : "",

            isVeg:
              Boolean(isVeg),

            isSpicy:
              Boolean(isSpicy),

            isBestseller:
              Boolean(
                isBestseller
              ),

            isAvailable:
              isAvailable ===
              undefined
                ? true
                : Boolean(
                    isAvailable
                  ),

            category: {
              connect: {
                id: categoryId,
              },
            },
          },

          include: {
            category: true,
          },
        });

      res.status(201).json({
        success: true,
        message:
          "Dish added successfully",
        data:
          formatMenuItem(item),
      });
    } catch (error) {
      console.error(
        "Add menu item error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to add menu item",
      });
    }
  }
);

// =====================================================
// ADMIN - UPDATE MENU ITEM
// =====================================================

app.put(
  "/api/admin/menu/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        name,
        description,
        price,
        imageUrl,
        isVeg,
        isSpicy,
        isBestseller,
        isAvailable,
        categoryId,
      } = req.body;

      const existingItem =
        await prisma.menuItem.findUnique(
          {
            where: {
              id,
            },
          }
        );

      if (!existingItem) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Menu item not found",
          });
      }

      const updateData = {};

      if (name !== undefined) {
        if (
          !String(name).trim()
        ) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "Dish name cannot be empty",
            });
        }

        updateData.name =
          String(name).trim();
      }

      if (
        description !==
        undefined
      ) {
        updateData.description =
          description !== null
            ? String(
                description
              )
            : "";
      }

      if (
        price !== undefined
      ) {
        if (
          price === null ||
          Number.isNaN(
            Number(price)
          ) ||
          Number(price) < 0
        ) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "Invalid price",
            });
        }

        updateData.price =
          Number(price);
      }

      if (
        imageUrl !== undefined
      ) {
        updateData.imageUrl =
          imageUrl !== null
            ? String(imageUrl)
            : "";
      }

      if (isVeg !== undefined) {
        updateData.isVeg =
          Boolean(isVeg);
      }

      if (
        isSpicy !== undefined
      ) {
        updateData.isSpicy =
          Boolean(isSpicy);
      }

      if (
        isBestseller !==
        undefined
      ) {
        updateData.isBestseller =
          Boolean(
            isBestseller
          );
      }

      if (
        isAvailable !==
        undefined
      ) {
        updateData.isAvailable =
          Boolean(
            isAvailable
          );
      }

      if (
        categoryId !==
        undefined
      ) {
        const category =
          await prisma.menuCategory.findUnique(
            {
              where: {
                id: categoryId,
              },
            }
          );

        if (!category) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "Selected category does not exist",
            });
        }

        updateData.category = {
          connect: {
            id: categoryId,
          },
        };
      }

      const updatedItem =
        await prisma.menuItem.update({
          where: {
            id,
          },

          data: updateData,

          include: {
            category: true,
          },
        });

      res.json({
        success: true,
        message:
          "Dish updated successfully",
        data:
          formatMenuItem(
            updatedItem
          ),
      });
    } catch (error) {
      console.error(
        "Update menu item error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update menu item",
      });
    }
  }
);

// =====================================================
// ADMIN - DELETE MENU ITEM
// =====================================================

app.delete(
  "/api/admin/menu/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      const existingItem =
        await prisma.menuItem.findUnique(
          {
            where: {
              id,
            },
          }
        );

      if (!existingItem) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Menu item not found",
          });
      }

      await prisma.menuItem.delete({
        where: {
          id,
        },
      });

      res.json({
        success: true,
        message:
          "Dish deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete menu item error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete dish. It may already be used in an order.",
      });
    }
  }
);

// =====================================================
// ADMIN - GET CATEGORIES
// =====================================================

app.get(
  "/api/admin/categories",
  adminAuth,
  async (req, res) => {
    try {
      const categories =
        await prisma.menuCategory.findMany(
          {
            orderBy: {
              name: "asc",
            },
          }
        );

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error(
        "Get categories error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch categories",
      });
    }
  }
);

// =====================================================
// ORDERS - CREATE COD ORDER
// =====================================================

app.post(
  "/api/orders",
  auth,
  async (req, res) => {
    try {
      const {
        items,
        address,
        phone,
        mobile,
        type,
        orderType,
        specialInstructions,
        paymentMethod,
      } = req.body;

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Order items are required",
          });
      }

      const selectedPaymentMethod =
        String(
          paymentMethod || "COD"
        ).toUpperCase();

      if (
        selectedPaymentMethod !==
        "COD"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Online payment is not enabled yet. Please use Cash on Delivery.",
          });
      }

      const customer =
        await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
        });

      if (!customer) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Customer account not found",
          });
      }

      const selectedType =
        String(
          type ||
            orderType ||
            "DELIVERY"
        ).toUpperCase();

      if (
        !VALID_ORDER_TYPES.includes(
          selectedType
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Order type must be DELIVERY or TAKEAWAY",
          });
      }

      const orderMobile =
        phone ||
        mobile ||
        customer.phone;

      if (
        !orderMobile ||
        !String(
          orderMobile
        ).trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Phone number is required",
          });
      }

      const cleanAddress =
        address != null
          ? String(
              address
            ).trim()
          : "";

      if (
        selectedType ===
          "DELIVERY" &&
        !cleanAddress
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Delivery address is required",
          });
      }

      const requestedItems = [];

      for (const item of items) {
        const menuItemId =
          item.menuItemId;

        const quantity =
          Number(item.quantity);

        if (!menuItemId) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "Every item requires a menuItemId",
            });
        }

        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1 ||
          quantity > 50
        ) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "Each item quantity must be between 1 and 50",
            });
        }

        requestedItems.push({
          menuItemId:
            String(
              menuItemId
            ),
          quantity,

          specialInstructions:
            item.specialInstructions
              ? String(
                  item.specialInstructions
                ).trim()
              : null,
        });
      }

      const uniqueIds = [
        ...new Set(
          requestedItems.map(
            (item) =>
              item.menuItemId
          )
        ),
      ];

      if (
        uniqueIds.length !==
        requestedItems.length
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Duplicate menu items are not allowed in the order request",
          });
      }

      const databaseItems =
        await prisma.menuItem.findMany({
          where: {
            id: {
              in: uniqueIds,
            },
          },
        });

      if (
        databaseItems.length !==
        uniqueIds.length
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "One or more menu items do not exist",
          });
      }

      const databaseItemMap =
        new Map(
          databaseItems.map(
            (item) => [
              item.id,
              item,
            ]
          )
        );

      const secureItems =
        requestedItems.map(
          (requestedItem) => {
            const menuItem =
              databaseItemMap.get(
                requestedItem.menuItemId
              );

            if (
              !menuItem.isAvailable
            ) {
              const error =
                new Error(
                  `${menuItem.name} is currently unavailable`
                );

              error.statusCode =
                400;

              throw error;
            }

            return {
              menuItemId:
                menuItem.id,

              quantity:
                requestedItem.quantity,

              unitPrice:
                Number(
                  menuItem.price
                ),

              specialInstructions:
                requestedItem.specialInstructions,
            };
          }
        );

      const subtotal =
        secureItems.reduce(
          (sum, item) =>
            sum +
            item.unitPrice *
              item.quantity,
          0
        );

      const tax = 0;
      const deliveryCharge = 0;
      const discount = 0;

      const total =
        subtotal +
        tax +
        deliveryCharge -
        discount;

      const order =
        await prisma.$transaction(
          async (tx) => {
            return tx.order.create({
              data: {
                userId:
                  customer.id,

                customerName:
                  customer.name,

                mobile: String(
                  orderMobile
                ).trim(),

                email:
                  customer.email,

                type:
                  selectedType,

                address:
                  selectedType ===
                  "DELIVERY"
                    ? cleanAddress
                    : cleanAddress ||
                      null,

                specialInstructions:
                  specialInstructions
                    ? String(
                        specialInstructions
                      ).trim()
                    : null,

                subtotal,
                tax,
                deliveryCharge,
                discount,
                total,

                status:
                  "PENDING",

                paymentStatus:
                  "PENDING",

                items: {
                  create:
                    secureItems.map(
                      (item) => ({
                        menuItemId:
                          item.menuItemId,

                        quantity:
                          item.quantity,

                        unitPrice:
                          item.unitPrice,

                        specialInstructions:
                          item.specialInstructions,
                      })
                    ),
                },

                payment: {
                  create: {
                    provider:
                      "COD",

                    amount:
                      total,

                    status:
                      "PENDING",
                  },
                },
              },

              include: {
                items: {
                  include: {
                    menuItem:
                      true,
                  },
                },

                payment: true,
              },
            });
          }
        );

      res.status(201).json({
        success: true,
        message:
          "Order placed successfully",
        data:
          formatOrder(order),
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      const statusCode =
        error.statusCode ||
        500;

      res
        .status(statusCode)
        .json({
          success: false,

          message:
            statusCode === 500
              ? "Failed to create order"
              : error.message,
        });
    }
  }
);

// =====================================================
// ORDERS - GET CURRENT CUSTOMER ORDERS
// =====================================================

app.get(
  "/api/orders",
  auth,
  async (req, res) => {
    try {
      const orders =
        await prisma.order.findMany({
          where: {
            userId:
              req.user.id,
          },

          include: {
            items: {
              include: {
                menuItem: true,
              },
            },

            payment: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json({
        success: true,

        data:
          orders.map(
            formatOrder
          ),
      });
    } catch (error) {
      console.error(
        "Get orders error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders",
      });
    }
  }
);

// =====================================================
// ORDERS - GET ONE CUSTOMER ORDER
// =====================================================

app.get(
  "/api/orders/:id",
  auth,
  async (req, res) => {
    try {
      const order =
        await prisma.order.findFirst({
          where: {
            id: req.params.id,
            userId:
              req.user.id,
          },

          include: {
            items: {
              include: {
                menuItem: true,
              },
            },

            payment: true,
          },
        });

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found",
          });
      }

      res.json({
        success: true,
        data:
          formatOrder(order),
      });
    } catch (error) {
      console.error(
        "Get order error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch order",
      });
    }
  }
);

// =====================================================
// ADMIN - GET ALL ORDERS
// =====================================================

app.get(
  "/api/admin/orders",
  adminAuth,
  async (req, res) => {
    try {
      const orders =
        await prisma.order.findMany({
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },

            payment: true,

            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json({
        success: true,

        data:
          orders.map(
            formatOrder
          ),
      });
    } catch (error) {
      console.error(
        "Admin get orders error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders",
      });
    }
  }
);

// =====================================================
// ADMIN - UPDATE ORDER STATUS
// =====================================================

app.patch(
  "/api/admin/orders/:id/status",
  adminAuth,
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const normalizedStatus =
        String(
          status || ""
        ).toUpperCase();

      if (
        !VALID_ORDER_STATUSES.includes(
          normalizedStatus
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid order status",
          });
      }

      const existingOrder =
        await prisma.order.findUnique(
          {
            where: {
              id: req.params.id,
            },
          }
        );

      if (!existingOrder) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Order not found",
          });
      }

      if (
        existingOrder.type ===
          "DELIVERY" &&
        [
          "READY_FOR_PICKUP",
          "PICKED_UP",
        ].includes(
          normalizedStatus
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Pickup statuses cannot be used for a delivery order",
          });
      }

      if (
        existingOrder.type ===
          "TAKEAWAY" &&
        [
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ].includes(
          normalizedStatus
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Delivery statuses cannot be used for a takeaway order",
          });
      }

      const updatedOrder =
        await prisma.order.update({
          where: {
            id: req.params.id,
          },

          data: {
            status:
              normalizedStatus,
          },

          include: {
            items: {
              include: {
                menuItem: true,
              },
            },

            payment: true,
          },
        });

      res.json({
        success: true,

        message:
          "Order status updated successfully",

        data:
          formatOrder(
            updatedOrder
          ),
      });
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update order status",
      });
    }
  }
);

// =====================================================
// RESERVATIONS - CREATE
// =====================================================

app.post(
  "/api/reservations",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        mobile,
        date,
        time,
        guests,
        specialRequest,
      } = req.body;

      const reservationMobile =
        phone ?? mobile;

      if (
        !name ||
        !reservationMobile ||
        !date ||
        !time ||
        !guests
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Name, phone, date, time and number of guests are required",
          });
      }

      const guestCount =
        Number(guests);

      if (
        !Number.isInteger(
          guestCount
        ) ||
        guestCount < 1 ||
        guestCount > 50
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Number of guests must be between 1 and 50",
          });
      }

      const reservationDate =
        new Date(date);

      if (
        Number.isNaN(
          reservationDate.getTime()
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid reservation date",
          });
      }

      const reservation =
        await prisma.reservation.create(
          {
            data: {
              name: String(
                name
              ).trim(),

              email: email
                ? String(
                    email
                  )
                    .trim()
                    .toLowerCase()
                : "",

              mobile: String(
                reservationMobile
              ).trim(),

              date:
                reservationDate,

              time: String(
                time
              ).trim(),

              guests:
                guestCount,

              specialRequest:
                specialRequest
                  ? String(
                      specialRequest
                    ).trim()
                  : "",
            },
          }
        );

      res.status(201).json({
        success: true,

        message:
          "Reservation request submitted successfully",

        data:
          reservation,
      });
    } catch (error) {
      console.error(
        "Reservation error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create reservation",
      });
    }
  }
);

// =====================================================
// ADMIN - GET ALL RESERVATIONS
// =====================================================

app.get(
  "/api/admin/reservations",
  adminAuth,
  async (req, res) => {
    try {
      const reservations =
        await prisma.reservation.findMany({
          include: {
            table: true,

            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },

          orderBy: [
            {
              date: "desc",
            },
            {
              createdAt: "desc",
            },
          ],
        });

      res.json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      console.error(
        "Admin get reservations error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch reservations",
      });
    }
  }
);

// =====================================================
// ADMIN - UPDATE RESERVATION STATUS
// =====================================================

app.patch(
  "/api/admin/reservations/:id/status",
  adminAuth,
  async (req, res) => {
    try {
      const normalizedStatus =
        String(
          req.body.status || ""
        ).toUpperCase();

      if (
        !VALID_RESERVATION_STATUSES.includes(
          normalizedStatus
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid reservation status",
          });
      }

      const existingReservation =
        await prisma.reservation.findUnique({
          where: {
            id: req.params.id,
          },
        });

      if (!existingReservation) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Reservation not found",
          });
      }

      const updatedReservation =
        await prisma.reservation.update({
          where: {
            id: req.params.id,
          },

          data: {
            status:
              normalizedStatus,
          },

          include: {
            table: true,

            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });

      res.json({
        success: true,

        message:
          "Reservation status updated successfully",

        data:
          updatedReservation,
      });
    } catch (error) {
      console.error(
        "Update reservation status error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update reservation status",
      });
    }
  }
);

// =====================================================
// 404 API ROUTE
// =====================================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Unhandled error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

async function shutdown() {
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
}

process.on(
  "SIGINT",
  shutdown
);

process.on(
  "SIGTERM",
  shutdown
);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    "=========================================="
  );

  console.log(
    "   YA BASA RESTAURANT BACKEND"
  );

  console.log(
    "=========================================="
  );

  console.log(
    `Server running on: http://localhost:${PORT}`
  );

  console.log(
    `Health check:     http://localhost:${PORT}/api/health`
  );

  console.log(
    "Database:         PostgreSQL + Prisma"
  );

  console.log(
    "Orders:           COD enabled"
  );

  console.log(
    "Admin Orders:     enabled"
  );

  console.log(
    "Admin Reservations: enabled"
  );

  console.log(
    "=========================================="
  );
});