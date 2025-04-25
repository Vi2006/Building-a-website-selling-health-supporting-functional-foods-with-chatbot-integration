import React, { useEffect, useState } from "react";
import { WrapperHeaderAdmin } from "../AdminProduct/style";
import { useNavigate, useParams } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { Button, Form, Input, Menu, message } from "antd";
import { getItem } from "../../utils";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ThanhlyServices from "../../services/ThanhlyService";
import HeaderComponent from "../HeaderComponet/HeaderComponent";

export const Thanhly = () => {
  const { id } = useParams();
  const [thanhLy, setThanhLy] = useState({
    productId: "",
    discount: "",
    price: "",
    reason: "",
    name: "",
  });
  const [keySelected, setKeySelected] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
    getItem("Đơn hàng", "order", <ShoppingCartOutlined />),
  ];
  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setThanhLy((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      return newState;
    });
  };

  useEffect(() => {
    const fetchProduct = async (id) => {
      const res = await ProductService.getDetailsProduct(id);
      const productData = {
        ...thanhLy,
        name: res.data.name,
        productId: res.data._id,
        price: res.data.price,
      };
      setThanhLy(productData);
      form.setFieldsValue(productData); // ✅ Đồng bộ với Form
    };
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const onFinish = async () => {
    if (
      !thanhLy.productId ||
      !thanhLy.name ||
      !thanhLy.discount ||
      !thanhLy.reason ||
      !thanhLy.price
    ) {
      message.error("Vui lòng nhập đủ các trường!");
      return;
    }

    try {
      const res = await ThanhlyServices.createThanhly(thanhLy);
      message.success("Thanh lý thành công!"); // ✅ Thêm dòng này
      navigate(`/system/admin`);
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thanh lý sản phẩm!");
      console.error("Thanh lý thất bại:", error);
    }
  };

  return (
    <div>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "100vh",
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div
          style={{
            backgroundColor: "#f7f7f7", // ✅ màu nền nhẹ
            padding: "30px 40px",
            borderRadius: "16px",
            width: "900px", // ✅ giới hạn chiều rộng form
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // ✅ đổ bóng nhẹ
          }}
        >
          <WrapperHeaderAdmin
            style={{ marginBottom: "20px", fontSize: "24px" }}
          >
            Thanh lý sản phẩm
          </WrapperHeaderAdmin>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                value={thanhLy?.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Nhập vào giá tiền!" }]}
            >
              <Input
                value={thanhLy?.price}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, message: "nhập vào mã giảm giá!" }]}
            >
              <Input
                value={thanhLy?.discount}
                onChange={handleOnChange}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: true, message: "Nhập vào lý do giảm giá!" }]}
            >
              <Input
                value={thanhLy?.reason}
                onChange={handleOnChange}
                name="reason"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#e05050",
                  borderColor: "#e05050",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "0 24px",
                  height: "40px",
                  fontWeight: "bold",
                }}
              >
                Thanh lý
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
