import {
    getSale,
    AddProductOnSaleModel,
    RemoveSingleProductModel,
    RemoveEntireSaleModel,
    UpdateSaleModel
} from "../models/sales_mode.js";


// ✅ GET ALL SALES
export const GetSale = async (req, res) => {
    try {
        const result = await getSale();

        return res.status(200).json({
            msg: "Sale fetched successfully",
            response: result
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};


// ✅ ADD SALE WITH PRODUCTS
export const AddProductOnSale = async (req, res) => {
    try {
        const result = await AddProductOnSaleModel(req.body);

        return res.status(200).json({
            msg: "Sale created successfully",
            response: result
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};


// ✅ REMOVE SINGLE PRODUCT FROM SALE
export const RemoveSingleProduct = async (req, res) => {
    try {
        const { sale_id, product_id } = req.params;

        const result = await RemoveSingleProductModel(sale_id, product_id);

        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};


// ✅ DELETE SALE (ENTIRE SALE)
export const RemoveProduct = async (req, res) => {
    try {
        const { sale_id } = req.params;

        const result = await RemoveEntireSaleModel(sale_id);

        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};


// ✅ UPDATE SALE
export const UpdateSale = async (req, res) => {
    try {


        const result = await UpdateSaleModel(req.body);

        return res.status(200).json({
            msg: "Sale updated successfully",
            response: result
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};