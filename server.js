const express = require("express");

const app = express();

const { product } = require("./models");
const { category } = require("./models");

const PORT = 3000;

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/v1/products", async (req, res) => {
    try {
        const allProduct = await product.findAll();

        res.status(200).json({
            status: true,
            message: "get All Product Successfully!",
            total: allProduct.length,
            data: allProduct,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Can't Fetch from Database",
            error: error.message,
        });
    }
});

app.get("/api/v1/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productById = await product.findOne({ where: { id } });
        if (!productById) {
            return res.status(404).json({
                status: false,
                message: `Product with ID: ${id} not found`,
            });
        }
        res.status(200).json({
            status: true,
            message: `Product with ID: ${id} fetched successfully!`,
            data: productById,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Can't Fetch from Database",
            error: error.message,
        });
    }
});

app.post("/api/v1/products", async (req, res) => {
    const id = req.params.id;

    try {
        const { name, price, stock } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({
                status: false,
                message: "Name, Price, and Stock are required!",
            });
        }

        const newProduct = await product.create({
            name,
            price,
            stock,
        });

        // Respond with success
        res.status(201).json({
            status: true,
            message: "Product Created Successfully!",
            data: newProduct,
        });
    } catch (error) {
        // Handle any errors
        return res.status(500).json({
            status: false,
            message: "Failed to create product",
            error: error.message,
        });
    }
});

app.patch("/api/v1/products/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const { name, price, stock } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({
                status: false,
                message: "Name, Price, and Stock are required!",
            });
        }

        const productToUpdate = await product.findByPk(id);

        if (!productToUpdate) {
            return res.status(404).json({
                status: false,
                message: "Product not found!",
            });
        }

        const updateProduct = await productToUpdate.update({
            name,
            price,
            stock,
        });

        // Respond with success
        res.status(200).json({
            status: true,
            message: "Product Updated Successfully!",
            data: updateProduct,
        });
    } catch (error) {
        // Handle any errors
        return res.status(500).json({
            status: false,
            message: "Failed to update product",
            error: error.message,
        });
    }
});

app.delete("/api/v1/products/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const deleteProduct = await product.destroy({
            where: {
                id: productId,
            },
        });

        if (deleteProduct === 0) {
            return res.status(404).json({
                status: false,
                message: "Product Not Found!",
            });
        }

        res.status(200).json({
            status: true,
            message: "Product Deleted Successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Can't Fetch from Database",
            error: error.message,
        });
    }
});

app.get("/api/v1/categories", async (req, res) => {
    try {
        const allCategory = await category.findAll();

        res.status(200).json({
            status: true,
            message: "get All Category Successfully!",
            total: allCategory.length,
            data: allCategory,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Can't Fetch from Database",
            error: error.message,
        });
    }
});

app.get("/api/v1/categories/:id", async (req, res) => {
    const categoryId = req.params.id;

    try {
        const { id } = req.params;
        const categoryById = await category.findOne({ where: { id } });
        if (!categoryById) {
            return res.status(404).json({
                status: false,
                message: `Category with ID: ${id} not found`,
            });
        }
        res.status(200).json({
            status: true,
            message: `Category with ID: ${id} fetched successfully!`,
            data: categoryById,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Can't Fetch from Database",
            error: error.message,
        });
    }
});

app.post("/api/v1/category", async (req, res) => {
    const { category_name, description } = req.body;

    if (!category_name || !description) {
        return res.status(400).json({
            status: false,
            message: "Category Name and Description required ",
        });
    }

    try {
        const newCategory = await category.create({
            category_name: category_name,
            description: description,
        });

        res.status(201).json({
            status: true,
            message: "Category Created Successfully!",
            data: newCategory,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to Create Category",
            error: error.message,
        });
    }
});

app.delete("/api/v1/categories/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const categoryToDelete = await category.findByPk(id);

        if (!categoryToDelete) {
            return res.status(404).json({
                status: "Failed",
                message: "Category not found!",
                isSuccess: false,
            });
        }

        await categoryToDelete.destroy();

        return res.status(200).json({
            status: "Success",
            message: "Category deleted successfully!",
            isSuccess: true,
            data: null,
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "Failed to delete category data!",
            isSuccess: false,
            error: error.message,
        });
    }
});

app.patch("/api/v1/categories/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const categoryToUpdate = await category.findByPk(id);

        // if category not found
        if (!categoryToUpdate) {
            return res.status(404).json({
                status: "Failed",
                message: "Category not found!",
                isSuccess: false,
            });
        }

        // object destructuring
        const { category_name, description } = req.body;

        // update category
        await categoryToUpdate.update({
            category_name: category_name || categoryToUpdate.category_name,
            description: description || categoryToUpdate.description,
        });

        return res.status(200).json({
            status: "Success",
            message: "Category updated successfully!",
            isSuccess: true,
            data: categoryToUpdate, // Mengembalikan data kategori yang telah diupdate
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "Failed to update category!",
            isSuccess: false,
            error: error.message,
        });
    }
});

app.use("/", async (req, res) => {
    res.status(200).json({
        status: true,
        message: "Ping Successfully!",
    });
});

// middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: "URL Not Found",
        data: null,
    });
});

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Click to open:`, url);
});
