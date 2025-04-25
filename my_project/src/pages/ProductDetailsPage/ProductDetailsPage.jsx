import React from "react";
import { ProductDetailsComponent } from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{ padding: "0 120px", background: "#efefef", minHeight: "100vh" }}
    >
      <h3>
        <span
          style={{ cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Trang chủ
        </span>{" "}
        -{" "}
        <span style={{ fontSize: "16px", fontWeight: "normal" }}>
          Chi tiết sản phẩm
        </span>
      </h3>

      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
