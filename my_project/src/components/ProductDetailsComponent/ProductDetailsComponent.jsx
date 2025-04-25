import { Col, Row, Image, Rate, message } from "antd";
import React, { useEffect, useState } from "react";
// import imageProduct from "../../assets/images/test.webp";
import imageProductSmall from "../../assets/images/imagesmall.webp";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceRow,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BuyLater, BuyNow } from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/Slides/orderSlide";
import { WrapperDiscountText } from "../CardComponent/style";
import commentServices from "./CommentServices";
import * as mess from "../../components/Message/Message";
function dinhDangNgayThangVietNam(createdAt) {
  const options = {
    weekday: "long", // Lấy tên thứ đầy đủ
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const ngayThangVietNam = createdAt.toLocaleDateString("vi-VN", options);
  return ngayThangVietNam;
}

export const ProductDetailsComponent = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [rating, setRating] = useState(null)
  const [comment, setComment] = useState({
    userId: user.id,
    productId: idProduct,
    content: "",
    images: [],
    rating: 0,
    toId: "",
  });
  const [numProduct, setNumProduct] = useState(1);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleChangeComment = (e) => {
    setComment({
      ...comment,
      content: e.target.value,
    });
  };

  useEffect(() => {
    const fetchComment = async () => {
      const res = await commentServices.getComments({ productId: idProduct });
      if (res.status === 400) {
        mess.warning("Co loi khi tai binh luan");
      } else {
        mess.success("Tai binh luan thanh");
        console.log("data comment tra ve", res.data);
        setCommentList(res.data.data);
      }
    };
    fetchComment();
    console.log("id", idProduct);
  }, [idProduct, loading]);
  console.log("CommentList", commentList);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    try {
      // Đối với mỗi file, tạo một FormData và tải lên Cloudinary
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "product_images"); // Thay thế bằng upload preset của bạn

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dzguzxt6u/image/upload",
          {
            // Thay thế bằng cloud name của bạn
            method: "POST",
            body: formData,
          }
        );
        console.log("data", response);
        const data = await response.json();
        return data.secure_url; // Trả về URL của ảnh đã tải lên
      });

      // Chờ tất cả các ảnh được tải lên
      const imageUrls = await Promise.all(uploadPromises);

      // Cập nhật state với các URL của ảnh đã tải lên
      setComment({ ...comment, images: imageUrls });

      console.log("Ảnh đã được tải lên thành công!");
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
    }
  };

  const removeImage = (ind) => {
    const imageFilted = comment.images.filter((item, index) => index !== ind);
    setComment({ ...comment, images: imageFilted });
  };

  const handleComment = async () => {
    console.log("comment moi tao ne nhe", comment);
    const newData = { ...comment, userId: user.id };
    console.log("new Data", newData);

    const res = await commentServices.createComment(newData);
    if (!res?.data) {
      message.warning(res?.message);
    } else {
      setLoading(true);
      setShow(false);
    }
  };

  const changeRate = (value) => {
    setComment({
      ...comment,
      rating: value,
    });
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      // console.log("Resdata", res.data);
      if (res.data.expiredDate) {
        const date = new Date(res.data.expiredDate);
        const formatted = date.toLocaleDateString("vi-VN");
        return { ...res.data, expired: formatted };
      }
      return res.data;
    }
  };

  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumProduct(numProduct + 1);
    } else {
      if (numProduct - 1 <= 0) {
        return;
      }
      setNumProduct(numProduct - 1);
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  function daysBetween(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = inputDate - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 50 && diffDays >= 20) {
      return 30;
    }

    return 0; // không giảm giá nếu ngoài khoảng
  }

  const giamgia =
    productDetails?.discount > 0
      ? productDetails.discount
      : daysBetween(productDetails?.expiredDate) > 0
      ? daysBetween(productDetails?.expiredDate)
      : 0;

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      // {
      //   name: { type: String, required: true },
      //   amount: { type: Number, required: true },
      //   image: { type: String, required: true },
      //   price: { type: String, required: true },
      //   product: {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "Product",
      //     required: true,
      //   },
      // },
      if (productDetails.countInStock < numProduct) {
        mess.error("Số lượng tồn kho không đủ vui lòng chọn sản phẩm khác");
        return;
      }
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: giamgia,
          },
        })
      );
      message.success("Thêm vào giỏ hàng thành công");
    }
  };

  return (
    <Loading isPending={isPending}>
      <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview={false}
          />
          <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
                width={110}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
                width={110}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
                width={110}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
                width={110}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
                width={110}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />

            <WrapperStyleTextSell>
              {" "}
              | Đã bán {`${productDetails?.sold}`}
            </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceRow>
              {giamgia > 0 ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <WrapperPriceTextProduct
                      style={{ textDecoration: "line-through" }}
                    >
                      {productDetails?.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </WrapperPriceTextProduct>
                    <WrapperDiscountText>
                      -{" "}
                      {productDetails.discount
                        ? productDetails.discount
                        : giamgia}{" "}
                      %
                    </WrapperDiscountText>
                  </div>
                  <WrapperPriceTextProduct
                    style={{ marginTop: "0px", color: "red", fontSize: "40px" }}
                  >
                    {(productDetails.discount === 0
                      ? productDetails?.price -
                        (giamgia / 100) * productDetails?.price
                      : productDetails?.price -
                        (productDetails.discount / 100) * productDetails?.price
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </WrapperPriceTextProduct>
                </div>
              ) : (
                <WrapperPriceTextProduct>
                  {productDetails?.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </WrapperPriceTextProduct>
              )}
            </WrapperPriceRow>
          </WrapperPriceProduct>

          <div>
            <p style={{ whiteSpace: "pre-line" }}>
              <strong>Mô tả ngắn:</strong>{" "}
              {productDetails?.description || "Không có dữ liệu"}
            </p>
            <p>
              <strong>Thương hiệu:</strong>{" "}
              {productDetails?.trademark || "Không có dữ liệu"}
            </p>
            <p>
              <strong>Nhà sản xuất:</strong>{" "}
              {productDetails?.manufacturer || "Không có dữ liệu"}
            </p>
            <p>
              <strong>Thành phần:</strong>{" "}
              {productDetails?.ingredients || "Không có dữ liệu"}
            </p>
            {productDetails?.countInStock > 5 ? (
              <p>
                <strong>Tồn kho:</strong> {productDetails?.countInStock}
              </p>
            ) : (
              <span className="sap-het-hang">Sắp hết hàng</span>
            )}
            <p>
              <strong>Ngày hết hạn:</strong>{" "}
              {productDetails?.expired || "Không có dữ liệu"}
            </p>
          </div>

          {/* <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className="address">{user?.address}</span>
            <span className="change-address">-Đổi địa chỉ</span>
          </WrapperAddressProduct> */}
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            {!user.isAdmin && (
              <div style={{ marginBottom: "10px" }}>Số lượng </div>
            )}
            {!user.isAdmin && (
              <WrapperQualityProduct>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChangeCount("decrease")}
                >
                  <MinusOutlined
                    style={{
                      color: "#000",
                      fontSize: "17px",
                    }}
                  />
                </button>
                <WrapperInputNumber
                  onChange={onChange}
                  defaultValue={1}
                  value={numProduct}
                  size="small"
                />

                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChangeCount("increase")}
                >
                  <PlusOutlined
                    style={{
                      color: "#000",
                      fontSize: "17px",
                    }}
                  />
                </button>
              </WrapperQualityProduct>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!user.isAdmin && (
              <BuyNow
                text="Thêm vào giỏ hàng"
                onClick={handleAddOrderProduct}
                disabled={false}
              />
            )}
          </div>
        </Col>
      </Row>
      <div
        className="flex justify-center text-[#101010]"
        style={{ backgroundColor: "#fff", marginTop: "2px" }}
      >
        <div className="flex flex-col items-center  py-[27px]">
          <div className="flex justify-center">
            <span className="text-[40px] font-bold leading-[47px] mr-[32px]">
              {`${productDetails?.rating?.toFixed(2)} / 5`}
            </span>
            <div className="flex flex-col items-center justify-center text-[#101010]">
              <span className="text-[14px] mt-[4px]">{`${productDetails?.votes} đánh giá `}</span>
            </div>
          </div>

          <div className="text-[#101010] mt-[16px] text-center">
            <span className="inline mt-[16px] text-center">
              {(productDetails?.sold || 0) > 0 &&
              productDetails?.votes !== undefined
                ? `${(
                    ((productDetails?.votes || 0) /
                      (productDetails?.sold || 1)) *
                    100
                  ).toFixed(2)}% khach hang danh gia san pham nay`
                : productDetails?.sold === 0
                ? "Chưa có lượt bán nào"
                : " "}
            </span>
          </div>
          {!show && !user.isAdmin && (
            <button
              className=" items-center bg-[color(srgb_0.181961_0.222745_0.596078)] border-[#0000] rounded-full border border-[0.8px] text-white font-inter text-sm font-medium justify-center tracking-[-0.14px] leading-[23.8px] px-6 py-3 text-center uppercase p-0 mt-[12px]"
              onClick={() => setShow(true)}
            >
              <span
                className="flex items-center justify-center text-white text-sm font-medium gap-2 tracking-[-0.14px] leading-[14px] text-center uppercase p-0 m-0"
                style={{ padding: "5px" }}
              >
                <div
                  className="text-white fill-none text-sm font-medium tracking-[-0.14px] leading-[14px] text-center uppercase"
                  style={{ padding: "3px" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M19.2 13.2V18.2C19.2 18.8 18.8 19.2 18.2 19.2H5.80005C5.20005 19.2 4.80005 18.8 4.80005 18.2V5.8C4.80005 5.2 5.20005 4.8 5.80005 4.8H10.8M17.3 4.4L10.3 11.4L9.70005 14.3L12.6 13.7L19.6 6.7C19.8 6.5 19.8 6.2 19.6 6L18 4.4C17.8 4.2 17.5 4.2 17.3 4.4Z"
                      stroke="currentColor"
                    ></path>
                  </svg>
                </div>
                đánh giá
              </span>
            </button>
          )}
        </div>
      </div>
      {show && (
        <div
          className="flex items-center justify-center"
          style={{ backgroundColor: "#fff" }}
        >
          <div className="flex gap-[12px] flex-col mb-[12px]">
            <div className="flex items-center justify-center">
              <Rate
                value={comment.rating}
                onChange={(value) => changeRate(value)}
              ></Rate>
            </div>
            <textarea
              className="border border-gray p-1.5 w-[300px]"
              type="text"
              placeholder="Nhap vao danh gia cua ban"
              onChange={(e) => handleChangeComment(e)}
            ></textarea>
            <input
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e)}
              className="flex items-center w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-2
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100 h-[42]px]"
            />
            {
              <div className="mt-2 grid grid-cols-9 gap-2">
                {comment.images &&
                  comment.images.map((item, index) => (
                    <div key={index} className="relative inline-block">
                      <img
                        src={item}
                        alt={`Product ${index}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        *
                      </button>
                    </div>
                  ))}
              </div>
            }
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-800 rounded-lg text-white flex font-semibold justify-center leading-5 mt-10 p-1 text-center text-[12px] font-arial w-[300px]"
                type="button"
                onClick={() => handleComment()}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col" style={{ backgroundColor: "#fff" }}>
        {/* Phan nay la chua muc phan loai theo so sao tu 1 den 5 */}
        <div className="flex items-center justify-between mb-[12px]">
          <div className="flex items-center justify-center bg-[#0010180d] rounded-3xl shadow-[0px_0px_0px_1px_#3643ba] text-[#3643ba] text-sm font-bold leading-[14px] p-1.5 px-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              strokeWidth="1.5"
              aria-hidden="true"
              data-metatip="true"
            >
              <path
                d="M12 15.9L16.8 19.3L15 13.7L19.7 10.3H13.8L12 4.70001L10.2 10.3H4.30005L9.00005 13.7L7.20005 19.3L12 15.9Z"
                stroke="currentColor"
              ></path>
            </svg>
            <div
              className="text-[#3643ba] text-[12px] font-bold leading-[12px] px-1.5 w-[120px]"
              style={{ backgroundColor: "#fff", marginTop: "2px" }}
            >
              {` Tat ca danh gia (${commentList?.length})`}
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor"></path>
            </svg>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              // backgroundColor: "#fff",
              padding: "2px",
              marginTop: "5px",
            }}
          >
            {commentList?.length &&
              commentList.map((item, index) => (
                <div
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    borderBottom: "2px solid gray",
                    gap: "150px",
                    padding: "10px",
                    width: "98%",
                  }}
                >
                  <div
                    className=""
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <span className="review-user-name">{item.name}</span>
                    <span className="review-date">
                      {dinhDangNgayThangVietNam(new Date(item?.createdAt))}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div className="review-body">
                      <span>{`${item.rating} / 5`}</span>
                    </div>
                    <div className="review-text">{item.content}</div>
                    <div className="review-images">
                      {item.images &&
                        item.images.map((it, index) => (
                          <div
                            key={index}
                            className=""
                            style={{ width: "100px", height: "100px" }}
                          >
                            <img
                              src={it}
                              alt={`Product ${index}`}
                              className=""
                              style={{ width: "100px", height: "100px" }}
                            />
                          </div>
                        ))}
                    </div>

                    {item.replies?.map((it, index) => (
                      <div className="bg-[#f5f4f5] text-[#101010] my-4 p-[15px_21px] w-full">
                        <div className="flex items-center text-[#101010]">
                          <span className="text-[#101010] font-bold">
                            Brand's Answer
                          </span>
                        </div>
                        <div className="text-[#101010] inline mt-4 w-full">
                          {it.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Loading>
  );
};
