import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperProducts, WrapperTypeProduct } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponet";
import Slider1 from "../../assets/images/Slider1.webp";
import Slider2 from "../../assets/images/Slider2.webp";
import Slider3 from "../../assets/images/Slider3.webp";
import { CardComponent } from "../../components/CardComponent/CardComponent";
import { BuyNow } from "../../components/ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
  const searchProduct = useSelector((state) => state.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const type = useSelector((state) => state.type);

  const fetProductAll = async (search, limit, type, expiredDate) => {
    // const limit = context?.queryKey && context?.queryKey[1];
    // const search = context?.queryKey && context?.queryKey[2];
    // const type = context?.queryKey && context?.queryKey[3];
    const res = await ProductService.getAllProduct(
      search,
      limit,
      type,
      expiredDate
    );
    // console.log("Res", res);
    setData(res.data.data);
    setTotal(res.data);
    return res;
  };

  useEffect(() => {
    setIsPending(true);
    fetProductAll(searchDebounce, limit, type.type, 1);
    setIsPending(false);
  }, [searchDebounce, limit, type.type]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  // const {
  //   isPending,
  //   data: products,
  //   isFetching,
  // } = useQuery({
  //   queryKey: ["products", limit, searchDebounce, type.type],
  //   queryFn: fetProductAll,
  //   retry: 3,
  //   retryDelay: 1000,
  //   keepPreviousData: true,
  // });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  useEffect(() => {
    console.log("Type", type.type);
  }, [type.type]);

  const sliderImages = [Slider1, Slider2, Slider3];

  return (
    <Loading isPending={isPending || isPending}>
      <div style={{ padding: "0 120px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return (
              <TypeProduct
                name={item}
                key={item}
                yes={type.type.includes(item) ? true : false}
              />
            );
          })}
        </WrapperTypeProduct>
        <div
          id="container"
          style={{
            backgroundColor: "#efefef",
            padding: "0 120px",
            margin: "0 -120px",
            marginBottom: "0",
            height: "2000px",
          }}
        >
          <SliderComponent arrImages={sliderImages} />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <WrapperProducts>
              <div className="grid">
                {data?.map((product) => {
                  return (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      sold={product.sold}
                      discount={product.discount}
                      id={product._id}
                      trademark={product.trademark}
                      manufacturer={product.manufacturer}
                      ingredients={product.ingredients}
                      expiredDate={product.expiredDate}
                      dathanhly={product.dathanhly}
                    />
                  );
                })}
              </div>
            </WrapperProducts>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {data.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  justifyContent: "center",
                  fontSize: "17px",
                }}
              >
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Sản phẩm này không tồn tại
                </span>
              </div>
            ) : (
              <BuyNow
                text={isPending ? "Tải thêm" : "Xem thêm"}
                disabled={
                  total?.total === data?.length || total?.totalPage === 1
                }
                onClick={() => setLimit((prev) => prev + 6)}
              />
            )}
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
