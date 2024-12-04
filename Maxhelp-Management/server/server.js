  const express = require("express");
  const axios = require("axios");
  const cors = require("cors");
  const { Sequelize, DataTypes, Op } = require("sequelize");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const nodemailer = require("nodemailer");
  require("dotenv").config();

  const app = express();
  const port = process.env.PORT || 5000;

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.json());

  // Database connection
  const sequelize = new Sequelize(
    "postgresql://dbmaxhelp:aw8wOHDjJ0TrdmE5mnJ8fjsTkcXWWKut@dpg-csv046l2ng1s73dqfct0-a.oregon-postgres.render.com/dbmaxhelp",
    {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }
  );

  // Test database connection
  sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Unable to connect to the database:", err));

  // Define models
  const BusinessUnit = sequelize.define(
    "businessunit",
    {
      businessunitid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    { tableName: "businessunit", timestamps: false }
  );

  const Product = sequelize.define(
    "product",
    {
      productid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      businessunitid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stockquantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reorderlevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
    },
    { tableName: "product", timestamps: false }
  );

  const User = sequelize.define(
    "user",
    {
      userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      passwordhash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    { tableName: "users", timestamps: false }
  );

  const Sale = sequelize.define(
    "sale",
    {
      saleid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantitysold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      saleprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      saledate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      businessunitid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "sales", timestamps: false }
  );

    const Feedback = sequelize.define(
      "feedback",
      {
        feedbackid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        productname:{
          type: DataTypes.STRING,
        },
        customername: {
          type: DataTypes.STRING(100),
        },
        email: {
          type: DataTypes.STRING(100),
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        feedbackdate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        businessunitid: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      { tableName: "feedback", timestamps: false }
    );

  // Set up associations
  Product.belongsTo(BusinessUnit, { foreignKey: "businessunitid" });
  Sale.belongsTo(Product, { foreignKey: "productid" });
  Sale.belongsTo(BusinessUnit, { foreignKey: "businessunitid" });
  Sale.belongsTo(User, { foreignKey: "userid" });
  Feedback.belongsTo(BusinessUnit, { foreignKey: "businessunitid" });

  // Authentication middleware
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Role-based access control middleware
  const authorize = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  };
let UserEmail
  // API Routes

  // User registration
  app.post("/api/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await User.create({
        username: username,
        email: email,
        passwordhash: hashedPassword,
        role: role || "User",
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Error in user registration:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User sign in
  app.post("/api/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username: username } });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      UserEmail = user.email;

      const validPassword = await bcrypt.compare(password, user.passwordhash);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.userid, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } catch (err) {
      console.error("Error in sign in:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  
  

  // Function to send email alerts
  const sendAlert = async (subject, text) => {
    const token =
      "mlsn.61a98430cc5d868a084f40a3f818b946ed15e3c964f04526a32177015295fb76";
    const url = "https://api.mailersend.com/v1/email";

    const data = {
      from: {
        email: "agochukwudavid@gmail.com",
      },
      to: [
        {
          email: UserEmail,
        },
      ],
      subject: subject,
      text: text,
      html: text,
    };

    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Email sent successfully:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error sending email:",
          error.response ? error.response.data : error.message
        );
      });
  };


  // Check authentication
  app.get("/api/check-auth", authenticateToken, (req, res) => {
    res.sendStatus(200);
  });

  // Get all business units
  app.get("/api/business-units", authenticateToken, async (req, res) => {
    try {
      const businessUnits = await BusinessUnit.findAll();
      res.json(businessUnits);
    } catch (err) {
      console.error("Error fetching business units:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get all products
  app.get("/api/products", authenticateToken, async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [{ model: BusinessUnit, attributes: ["name", "location"] }],
      });
      res.json(products);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Add a new product
  app.post(
    "/api/products",
    authenticateToken,
    authorize(["Admin"]),
    async (req, res) => {
      const { name, businessunitid, price, stockquantity, reorderlevel } =
        req.body;

      try {
        const newProduct = await Product.create({
          name,
          businessunitid,
          price,
          stockquantity,
          reorderlevel,
        });
        res.status(201).json(newProduct);
      } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  // Delete a product
app.delete(
  "/api/products/:id",
  authenticateToken,
  authorize(["Admin"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      // Find the product by primary key (ID)
      const product = await Product.findByPk(id);

      // If product doesn't exist, return 404 error
      if (!product) {
        return res.status(404).send("Product not found");
      }

      // Destroy the product (delete from the database)
      await product.destroy();

      // Return success response
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
  // Get all sales
  app.get("/api/sales", authenticateToken, async (req, res) => {
    try {
      const sales = await Sale.findAll({
        include: [
          { model: Product, attributes: ["name"] },
          { model: BusinessUnit, attributes: ["name", "location"] },
          { model: User, attributes: ["username"] },
        ],
      });
      res.json(sales);

    } catch (err) {
      console.error("Error fetching sales:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.delete(
    "/api/sales/:id",
    authenticateToken,
    authorize(["Admin"]),
    async (req, res) => {
      const { id } = req.params;

      try {
        // Find the product by primary key (ID)
        const sale = await Sale.findByPk(id);

        // If product doesn't exist, return 404 error
        if (!sale) {
          return res.status(404).send("sale not found");
        }

        // Destroy the product (delete from the database)
        await sale.destroy();

        // Return success response
        res.status(200).json({ message: "sale deleted successfully" });
      } catch (err) {
        console.error("Error deleting sale:", err);
        res.status(500).send("Internal Server Error");
      }
    }
  );


  // Add a new sale
  app.post("/api/sales", authenticateToken, async (req, res) => {
    const { productid, quantitysold, saleprice, businessunitid } = req.body;

    try {
         const product = await Product.findByPk(productid);
         let newSale;
         let newStockQuantity;
          newStockQuantity = product.stockquantity - quantitysold;
            if (product.stockquantity - quantitysold > 0) {
              newSale = await Sale.create({
                productid,
                quantitysold,
                saleprice,
                businessunitid,
                userid: req.user.id,
              });
              await product.update({
                stockquantity: newStockQuantity,
              });
            }

      if (newStockQuantity <= product.reorderlevel) {
        console.log("hello");
        await sendAlert(
          "Low Stock Alert",
          `Product ${product.name} in ${product.businessunitid} is low on stock. Current quantity: ${newStockQuantity}`
        );
      }

      res.status(201).json(newSale);
    } catch (err) {
      console.error("Error adding sale:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get daily sales report
  app.get("/api/daily-sales", authenticateToken, async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailySales = await Sale.findAll({
        where: {
          saledate: {
            [Op.gte]: today,
          },
        },
        include: [
          { model: Product, attributes: ["name"] },
          { model: BusinessUnit, attributes: ["name", "location"] },
        ],
      });

      const totalIncome = dailySales.reduce(
        (sum, sale) => sum + parseFloat(sale.saleprice),
        0
      );
      res.json({ dailySales, totalIncome });
    } catch (err) {
      console.error("Error fetching daily sales:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get low stock items
  app.get("/api/low-stock", authenticateToken, async (req, res) => {
    try {
      const lowStockItems = await Product.findAll({
        where: {
          stockquantity: {
            [Op.lte]: Sequelize.col("reorderlevel"),
          },
        },
        include: [{ model: BusinessUnit, attributes: ["name", "location"] }],
      });

      res.json(lowStockItems);
    } catch (err) {
      console.error("Error fetching low stock items:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Add customer feedback
  app.post("/api/feedback", async (req, res) => {
    const { customername, productname, email, message, businessunitid } = req.body;

    try {
      const newFeedback = await Feedback.create({
        customername,
        productname,
        email,
        message,
        businessunitid,
      });

      res.status(201).json(newFeedback);
    } catch (err) {
      console.error("Error adding feedback:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get all feedback
  app.get("/api/feedback", authenticateToken, async (req, res) => {
    try {
      const feedback = await Feedback.findAll({
        include: [{ model: BusinessUnit, attributes: ["name", "location"] }],
      });
      res.json(feedback);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.delete(
    "/api/feedback/:id",
    authenticateToken,
    authorize(["Admin"]),
    async (req, res) => {
      const { id } = req.params;

      try {
        // Find the product by primary key (ID)
        const feedback = await Feedback.findByPk(id);

        // If product doesn't exist, return 404 error
        if (!feedback) {
          return res.status(404).send("sale not found");
        }

        // Destroy the product (delete from the database)
        await feedback.destroy();

        // Return success response
        res.status(200).json({ message: "feedback deleted successfully" });
      } catch (err) {
        console.error("Error deleting sale:", err);
        res.status(500).send("Internal Server Error");
      }
    }
  );




  // Get sales trends
app.get("/api/sales-trends", authenticateToken, async (req, res) => {
  try {
    const salesTrends = await Sale.findAll({
      attributes: [
        "productid",
        [Sequelize.fn("SUM", Sequelize.col("quantitysold")), "TotalSold"],
      ],
      include: [
        {
          model: Product,
          as: "product", // Explicitly specify the alias for the Product table
          attributes: ["name", "stockquantity", "reorderlevel"],
        },
      ],
      group: ["sale.productid", "product.productid"], // Match the alias for the Product table
      order: [[Sequelize.fn("SUM", Sequelize.col("quantitysold")), "DESC"]],
    });

    const reorderSuggestions = salesTrends
      .map((trend) => ({
        productid: trend.productid, // Access productid from the sale object
        productName: trend.product.dataValues.name, // Access product name from the nested product object
        TotalSold: parseInt(trend.dataValues.TotalSold), // Ensure TotalSold is a number
        CurrentStock: trend.product.dataValues.stockquantity, // Access stockquantity from product dataValues
        ReorderLevel: trend.product.dataValues.reorderlevel, // Access reorderlevel from product dataValues
        SuggestedReorder:
          Math.max(
            trend.product.dataValues.reorderlevel, // Ensure correct value is used for reorderlevel
            Math.ceil(parseInt(trend.dataValues.TotalSold) * 0.5) // Calculate SuggestedReorder using TotalSold
          ) - trend.product.dataValues.stockquantity, // Subtract current stock from the calculated reorder level
      }))
      .filter((suggestion) => suggestion.SuggestedReorder > 0); // Only keep suggestions where SuggestedReorder > 0

    res.json(reorderSuggestions);
  } catch (err) {
    console.error("Error fetching sales trends:", err);
    res.status(500).send("Internal Server Error");
  }
});
  // Update reorder levels
  app.put(
    "/api/product",
    authenticateToken,
    authorize(["Admin"]),
    async (req, res) => {
      const { updates } = req.body;

      try {
        for (let update of updates) {
          await Product.update(
            {
              reorderlevel: update.NewReorderLevel,
              price: update.NewPrice,
              stockquantity: update.NewStock,
            },
            { where: { productid: update.productid } }
          );
        }
        res.json({ message: "Reorder levels updated successfully" });
      } catch (err) {
        console.error("Error updating reorder levels:", err);
        res.status(500).send("Internal Server Error");
      }
    }
  );

  // Start the server
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
    });
  });

  module.exports = app;
