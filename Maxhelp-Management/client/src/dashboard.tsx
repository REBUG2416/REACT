"use client";

import { spawn } from "child_process";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

type Product = {
  productid: number;
  name: string;
  businessunitid: number;
  price: number;
  stockquantity: number;
  reorderlevel: number;
};

type BusinessUnit = {
  businessunitid: number;
  name: string;
  location: string;
};

type Sale = {
  SaleId: number;
  Product: { Name: string};
  Productid: number;
  BusinessUnit: { Name: string };
  BusinessUnitId:number;
  QuantitySold: number;
  SalePrice: number;
  SaleDate: Date;
};

type Feedback = {
  FeedbackId: number;
  ProductName: string;
  CustomerName: string;
  Email: string;
  Message: string;
  FeedbackDate: Date;
  BusinessUnit: { Name: string };
};

type SalesTrend = {
  productid: number;
  productName: string;
  TotalSold: number;
  CurrentStock: number;
  ReorderLevel: number;
  SuggestedReorder: number;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [navBar, setnavBar] = useState("Headquarters");
  const [activeEdit, setActiveEdit] =useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [dailySales, setDailySales] = useState({
    dailySales: [],
    totalIncome: 0,
  });
  const [outStock, setOutStock] = useState(false);
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [userRole, setUserRole] = useState("");
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [newSale, setNewSale] = useState<Partial<Sale>>({});
  const [newFeedback, setNewFeedback] = useState<Partial<Feedback>>({});
  const [currentBusinessUnit, setCurrentBusinessUnit] = useState<BusinessUnit>({
    businessunitid: 1,
    name: "Headquarters",
    location: "Island",
  });

  const router = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const [
        productsData,
        businessUnits,
        salesData,
        feedbackData,
        lowStockData,
        dailySalesData,
        salesTrendsData,
      ] = await Promise.all([
        fetch("http://localhost:5000/api/products", { headers }).then((res) =>
          res.json()
        ),
        fetch("http://localhost:5000/api/business-units", { headers }).then(
          (res) => res.json()
        ),
        fetch("http://localhost:5000/api/sales", { headers }).then((res) =>
          res.json()
        ),
        fetch("http://localhost:5000/api/feedback", { headers }).then((res) =>
          res.json()
        ),
        fetch("http://localhost:5000/api/low-stock", { headers }).then((res) =>
          res.json()
        ),
        fetch("http://localhost:5000/api/daily-sales", { headers }).then(
          (res) => res.json()
        ),
        fetch("http://localhost:5000/api/sales-trends", { headers }).then(
          (res) => res.json()
        ),
      ]);
const updatedSales = salesData.map((data: { saleid: any; product: { name: any; }; productid: any; businessunit: { name: any; }; businessunitid: any; quantitysold: any; saleprice: any; saledate: any; }) => ({
  SaleId: data.saleid,
  Product: { Name: data.product.name },
  Productid: data.productid,
  BusinessUnit: { Name: data.businessunit.name },
  BusinessUnitId: data.businessunitid,
  QuantitySold: data.quantitysold,
  SalePrice: data.saleprice,
  SaleDate: data.saledate
}));

const updatedFeedback = feedbackData.map((data: { feedbackid: any; productname: any; customername: any; email: any; message: any; feedbackdate: any; businessunit: { name: any; }; })=>({
 FeedbackId: data.feedbackid,
  ProductName: data.productname,
  CustomerName: data.customername,
  Email: data.email,
  Message: data.message,
  FeedbackDate: data.feedbackdate,
  BusinessUnit: { Name: data.businessunit.name}
}))


      setProducts(productsData);
      setBusinessUnits(businessUnits);
      setSales(updatedSales);
      setFeedback(updatedFeedback);
      setLowStockItems(lowStockData);
      setDailySales(dailySalesData);
      setSalesTrends(salesTrendsData);
console.log(dailySales);

      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(tokenPayload.role);
      console.log(tokenPayload.role);
    } catch (error) {
      console.error("Error fetching data:", error);
      router("/signin");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router("/signin");
  };

  const handleUpdate = async (
    productId: number,
    newPrice:number,
    newStock:number,
    newReorderLevel: number
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/product", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: [{ productid: productId, NewReorderLevel: newReorderLevel , NewPrice:newPrice,NewStock:newStock }],
        }),
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to update reorder level");
      }
    } catch (error) {
      console.error("Error updating reorder level:", error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setNewProduct({});
        fetchData();
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddSale = async (e: React.FormEvent) => {
    setOutStock(false);
    e.preventDefault();
    newSale.Productid = products.find((p)=>{return newSale.Product?.Name === p.name})?.productid;
    newSale.BusinessUnitId = currentBusinessUnit.businessunitid;
    console.log(newSale.Product?.Name);
    
    if (products.find((p)=>{return newSale.Product?.Name === p.name})?.stockquantity!-newSale.QuantitySold!<0)
setOutStock(true)
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/sales", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productid: newSale.Productid,
            quantitysold: newSale.QuantitySold,
            saleprice: newSale.SalePrice,
            businessunitid: newSale.BusinessUnitId,
          }),
        });

        if (response.ok) {
          setNewSale({});
          fetchData();
        } else {
          console.error("Failed to add sale");
        }
      } catch (error) {
        console.error("Error adding sale:", error);
      }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customername:newFeedback.CustomerName,
          productname : newFeedback.ProductName,
          email: newFeedback.Email,
          message: newFeedback.Message,
          businessunitid: businessUnits.find((unit)=>{return currentBusinessUnit.name === unit.name;})?.businessunitid
        }),
      });

      if (response.ok) {
        setNewFeedback({});
        fetchData();
      } else {
        console.error("Failed to add feedback");
      }
    } catch (error) {
      console.error("Error adding feedback:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setProducts(
          products.filter((product) => product.productid !== productId)
        );
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteSale = async (saleId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sales/${saleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setSales(sales.filter((sale) => sale.SaleId !== saleId));
      } else {
        console.error("Failed to delete sale");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const handleDeleteFeedback = async (feedbackId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/feedback/${feedbackId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setFeedback(feedback.filter((item) => item.FeedbackId !== feedbackId));
      } else {
        console.error("Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  let filterProduct;
  let filterDaily;
  let filterSales;
  let filterFeedback;
  if(currentBusinessUnit.businessunitid !== 1){
    filterProduct = products.filter((p) => {
                  return (
                    p.businessunitid === currentBusinessUnit.businessunitid
                  );
                })
filterDaily = {
  dailySales: dailySales.dailySales.filter(
    (d: any) => d.businessunitid === currentBusinessUnit.businessunitid
  ),
  totalIncome: dailySales.dailySales
    .filter((d: any) => d.businessunitid === currentBusinessUnit.businessunitid)
    .reduce((acc, current:any) => acc + Number(current.saleprice), 0),
};                filterSales = sales.filter((s) => {
                  return (
                    s.BusinessUnitId === currentBusinessUnit.businessunitid
                  );
                });
                filterFeedback = feedback.filter((f)=>{
                  return (
                    f.BusinessUnit.Name === currentBusinessUnit.name
                  );
                })
              console.log(filterDaily);
              
  }

  else{
  filterProduct = products;
  filterDaily =  dailySales;
  filterSales = sales;
  filterFeedback = feedback;
  }
  return (
    <div className="container">
      <div className="header" data-aos="fade-down" data-aos-duration="1000">
        <h1>Maxhelp Inventory Management</h1>
        <div>
          <span
            className={navBar === "Headquarters" ? "active" : ""}
            onClick={() => {
              setnavBar("Headquarters");
              setCurrentBusinessUnit(
                businessUnits.find((unit) => {
                  return unit.name === "Headquarters";
                })!
              );
            }}
          >
            Headquaters
          </span>
          <span
            className={navBar === "Bookshop" ? "active" : ""}
            onClick={() => {
              setnavBar("Bookshop");
              setCurrentBusinessUnit(
                businessUnits.find((unit) => {
                  return unit.name === "Bookshop";
                })!
              );
            }}
          >
            BookShop
          </span>
          <span
            className={navBar === "Restaurant" ? "active" : ""}
            onClick={() => {
              setnavBar("Restaurant");
              setCurrentBusinessUnit(
                businessUnits.find((unit) => {
                  return unit.name === "Restaurant";
                })!
              );
            }}
          >
            Restaurant
          </span>
          <span
            className={navBar === "Bottle" ? "active" : ""}
            onClick={() => {
              setnavBar("Bottle");
              setCurrentBusinessUnit(
                businessUnits.find((unit) => {
                  return unit.name === "Bottle Water Industry";
                })!
              );
            }}
          >
            Bottle Water
          </span>
        </div>
        <button onClick={handleSignOut} className="button">
          Sign Out
        </button>
      </div>
      <div className="tabs" data-aos="fade-right" data-aos-duration="1000">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={activeTab === "sales" ? "active" : ""}
          onClick={() => setActiveTab("sales")}
        >
          Sales
        </button>
        <button
          className={activeTab === "feedback" ? "active" : ""}
          onClick={() => setActiveTab("feedback")}
        >
          Feedback
        </button>
        <button
          className={activeTab === "trends" ? "active" : ""}
          onClick={() => setActiveTab("trends")}
        >
          Trends
        </button>
      </div>
      {activeTab === "overview" && (
        <div className="overview">
          <div className="stats">
            <div
              className="stat-card"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h3>Total Products</h3>
              <p>{filterProduct.length}</p>
            </div>
            <div
              className="stat-card"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <h3>Today's Sales</h3>
              <p>{filterDaily.dailySales ? dailySales.dailySales.length : 0}</p>
            </div>
            <div
              className="stat-card"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <h3>Total Income</h3>
              <p>₦{filterDaily.totalIncome}</p>
            </div>
            <div
              className="stat-card"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <h3>Feedback</h3>
              <p>{filterFeedback.length}</p>
            </div>
          </div>
          {lowStockItems.length > 0 && (
            <div
              className="alert"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <h3>Low Stock Alert</h3>
              <p>
                {lowStockItems.length} items are running low on stock. Please
                check the Products tab for details.
              </p>
            </div>
          )}
        </div>
      )}
      {activeTab === "products" && (
        <div className="products" data-aos="fade-up" data-aos-duration="1000">
          <h2>Products</h2>
          {userRole === "Admin" && (
            <form onSubmit={handleAddProduct}>
              <input
                required
                type="text"
                placeholder="Product Name"
                value={newProduct.name || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <select
                className="select"
                value={
                  businessUnits.find(
                    (unit) => newProduct.businessunitid === unit.businessunitid
                  )?.name || ""
                }
                style={{ color: "grey" }}
                onChange={(e) => {
                  e.target.style.color = "black";
                  setNewProduct({
                    ...newProduct,
                    businessunitid: businessUnits.find(
                      (unit) => e.target.value === unit.name
                    )?.businessunitid,
                  });
                }}
                required
              >
                <option value="" style={{ display: "none" }} disabled>
                  Business Unit Name
                </option>
                {businessUnits.slice(1).map((unit, index) => (
                  <option key={index} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <input
                required
                type="number"
                placeholder="Price"
                value={newProduct.price || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value),
                  })
                }
              />
              <input
                required
                type="number"
                placeholder="Stock Quantity"
                value={newProduct.stockquantity || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stockquantity: parseInt(e.target.value),
                  })
                }
              />
              <input
                required
                type="number"
                placeholder="Reorder Level"
                value={newProduct.reorderlevel || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    reorderlevel: parseInt(e.target.value),
                  })
                }
              />
              <button type="submit">Add Product</button>
            </form>
          )}
          <table className="tables">
            <thead>
              <tr>
                <th>Name</th>
                <th>Business Unit</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Reorder Level</th>
                {userRole === "Admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filterProduct.map((product) => (
                <tr
                  style={{
                    background:
                      product.stockquantity <= product.reorderlevel
                        ? "rgba(255, 0, 0, 0.095)"
                        : "",
                  }}
                  key={product.productid}
                >
                  <td>{product.name}</td>
                  <td>
                    {
                      businessUnits.find((unit) => {
                        return product.businessunitid === unit.businessunitid;
                      })?.name
                    }
                  </td>
                  <td>₦{product.price}</td>
                  <td
                    style={{
                      color:
                        product.stockquantity <= product.reorderlevel
                          ? "red"
                          : "",
                    }}
                  >
                    {product.stockquantity}
                  </td>
                  <td>{product.reorderlevel}</td>
                  {userRole === "Admin" && (
                    <>
                      <td
                        className={
                          activeEdit === product.productid
                            ? "interest active"
                            : "interest"
                        }
                      >
                        {activeEdit === product.productid ? (
                          <>
                          <span onClick={()=> setActiveEdit(0)} style={{cursor:"pointer",fontWeight:"bolder"}} >X</span>
                            <input
                              required
                              type="number"
                              defaultValue={product.price}
                              onChange={(e) =>
                                handleUpdate(
                                  product.productid,
                                  parseInt(e.target.value),
                                  product.stockquantity,
                                  product.reorderlevel
                                )
                              }
                            />
                            <input
                              required
                              type="number"
                              defaultValue={product.stockquantity}
                              onChange={(e) =>
                                handleUpdate(
                                  product.productid,
                                  product.price,
                                  parseInt(e.target.value),
                                  product.reorderlevel
                                )
                              }
                            />
                            <input
                              required
                              type="number"
                              defaultValue={product.reorderlevel}
                              onChange={(e) =>
                                handleUpdate(
                                  product.productid,
                                  product.price,
                                  product.stockquantity,
                                  parseInt(e.target.value)
                                )
                              }
                            />
                          </>
                        ) : (
                          <button
                            className="editbtn"
                            onClick={() => setActiveEdit(product.productid)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProduct(product.productid)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "sales" && (
        <div className="sales" data-aos="fade-up" data-aos-duration="1000">
          <h2>Sales</h2>
          {currentBusinessUnit.businessunitid !== 1 && (
            <>
              <form onSubmit={handleAddSale}>
                <select
                  className="select"
                  value={newSale.Product?.Name || ""}
                  style={{ color: "grey" }}
                  onChange={(e) => {
                    e.target.style.color = "black";
                    setNewSale({
                      ...newSale,
                      Product: { Name: e.target.value },
                    });
                  }}
                >
                  <option value="" style={{ display: "none" }} disabled>
                    <span style={{ color: "blue" }}>Select a product</span>
                  </option>
                  {filterProduct.map((product, index) => (
                    <option key={index} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <input
                  required
                  type="number"
                  placeholder="Quantity Sold"
                  value={newSale.QuantitySold || ""}
                  onChange={(e) => {
                    const quantitySold = parseInt(e.target.value); // Get the quantity sold
                    const salePrice =
                      quantitySold && newSale.Product?.Name
                        ? products.find((p) => p.name === newSale.Product?.Name)
                            ?.price! * quantitySold
                        : 0; // Calculate sale price based on quantitySold

                    setNewSale({
                      ...newSale,
                      QuantitySold: quantitySold,
                      SalePrice: salePrice || 0, // Ensure SalePrice is set correctly
                    });
                  }}
                />
                <input
                  required
                  type="number"
                  placeholder="Sale Price"
                  value={newSale.SalePrice || ""}
                  readOnly
                />
                <input
                  required
                  type="text"
                  placeholder="Business Unit Name"
                  value={currentBusinessUnit.name}
                  readOnly
                />
                <button type="submit">Add Sale</button>
                <br />
                {outStock && <span style={{ color: "red" }}>Out of stock</span>}
              </form>
            </>
          )}
          <table className="tables">
            <thead>
              <tr>
                <th>Product</th>
                <th>Business Unit</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterSales.map((sale) => (
                <tr key={sale.SaleId}>
                  <td>{sale.Product.Name}</td>
                  <td>{sale.BusinessUnit.Name}</td>
                  <td>{sale.QuantitySold}</td>
                  <td>₦{sale.SalePrice}</td>
                  <td>{new Date(sale.SaleDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteSale(sale.SaleId)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "feedback" && (
        <div className="feedback" data-aos="fade-up" data-aos-duration="1000">
          <h2>User Feedback</h2>
          {currentBusinessUnit.businessunitid !== 1 && (
            <>
              <form onSubmit={handleAddFeedback}>
                <input
                  required
                  type="text"
                  placeholder="Customer Name"
                  value={newFeedback.CustomerName || ""}
                  onChange={(e) =>
                    setNewFeedback({
                      ...newFeedback,
                      CustomerName: e.target.value,
                    })
                  }
                />
                <select
                  className="select"
                  value={newFeedback.ProductName || ""}
                  style={{ color: "grey" }}
                  onChange={(e) => {
                    e.target.style.color = "black";
                    setNewFeedback({
                      ...newFeedback,
                      ProductName: e.target.value,
                    });
                  }}
                >
                  <option value="" style={{ display: "none" }} disabled>
                    <span style={{ color: "blue" }}>Select a product</span>
                  </option>
                  {products
                    .filter((product) => {
                      return (
                        product.businessunitid ===
                        currentBusinessUnit.businessunitid
                      );
                    })
                    .map((product, index) => (
                      <option key={index} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                </select>
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={newFeedback.Email || ""}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, Email: e.target.value })
                  }
                />
                <textarea
                  placeholder="Message"
                  value={newFeedback.Message || ""}
                  onChange={(e) =>
                    setNewFeedback({ ...newFeedback, Message: e.target.value })
                  }
                ></textarea>
                <input
                  required
                  type="text"
                  placeholder="Business Unit Name"
                  value={currentBusinessUnit.name}
                  readOnly
                />
                <button type="submit">Submit Feedback</button>
              </form>
            </>
          )}
          {userRole === "Admin" && (
            <table className="tables">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Product Name</th>
                  <th>Business Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterFeedback.map((item) => (
                  <tr key={item.FeedbackId}>
                    <td>{item.CustomerName || "Anonymous"}</td>
                    <td>{item.Email || "N/A"}</td>
                    <td>{item.Message}</td>
                    <td>{new Date(item.FeedbackDate).toLocaleDateString()}</td>
                    <td>{item.ProductName}</td>
                    <td>{item.BusinessUnit.Name}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteFeedback(item.FeedbackId)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {activeTab === "trends" && (
        <div className="trends" data-aos="fade-up" data-aos-duration="1000">
          <h2>Sales Trends and Reorder Suggestions</h2>
          <table className="tables">
            <thead>
              <tr>
                <th>Product</th>
                <th>Total Sold</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Suggested Reorder</th>
              </tr>
            </thead>
            <tbody>
              {salesTrends.map((trend) => (
                <tr key={trend.productid}>
                  <td>{trend.productName}</td>
                  <td>{trend.TotalSold}</td>
                  <td>{trend.CurrentStock}</td>
                  <td>{trend.ReorderLevel}</td>
                  <td>{trend.SuggestedReorder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
