const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      // rating,
      description,
      trademark,
      manufacturer,
      ingredients,
      // discount,
      expiredDate,
    } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: " The name of product is already",
        });
      }
      const createProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        // rating,
        description,
        trademark,
        manufacturer,
        ingredients,
        // discount,
        expiredDate,
      });
      if (createProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: " The product is not defined",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: " The product is not defined",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "OK",
          message: " The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Success",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (
  limit,
  page,
  sort,
  search,
  filter,
  type,
  expiredDate
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      const query = {};
      // if (filter) {
      //   const label = filter[0];
      //   const allObjectFilter = await Product.find({
      //     [label]: { $regex: filter[1] },
      //   })
      //     .limit(limit)
      //     .skip(page * limit);
      //   resolve({
      //     status: "OK",
      //     message: "Success",
      //     data: allObjectFilter,
      //     total: totalProduct,
      //     pageCurrent: Number(page + 1),
      //     totalPage: Math.ceil(totalProduct / limit),
      //   });
      // }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: "OK",
          message: "Success",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      if (Array.isArray(type)) {
        query.type = { $in: Array.isArray(type) ? type : [type] };
      }
      if (search) {
        query.name = { $regex: search };
      }
      if (expiredDate) {
        const currentDate = new Date();
        const tenDaysFromNow = new Date();
        tenDaysFromNow.setDate(currentDate.getDate() + 10);
        query.expiredDate = { $gte: tenDaysFromNow };
      }
      console.log("Query", query);

      const all = await Product.find(query)
        .limit(limit)
        .skip(page * limit);
      console.log("product", all);
      resolve({
        status: "OK",
        message: "Success",
        data: all,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      console.log("e", e);
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // let allType = await Product.distinct("type");
      // console.log("allType", allType.length);
      let allType = ["Xương khớp", "Vitamin", "Đề kháng"];
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
