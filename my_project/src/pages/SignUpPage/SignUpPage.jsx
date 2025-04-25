import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import { Input, Image } from "antd";
import { BuyLogin } from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo_login.webp";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  // const handleSignUp = () => {
  //   mutation.mutate({ email, password, confirmPassword });
  // };

  const handleSignUp = () => {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      message.error("Email không hợp lệ, vui lòng nhập lại");
      return;
    }
    if (password.length < 6) {
      message.error("Vui lòng nhập mật khẩu ít nhất 6 kí tự");
      return;
    }
    if (!email || !password || !confirmPassword) {
      message.error("Thông tin không hợp lệ, vui lòng nhập lại");
      return;
    }

    if (!isValidEmail(email)) {
      message.error("Thông tin không hợp lệ, vui lòng nhập lại");
      return;
    }

    if (password !== confirmPassword) {
      message.error("mật khẩu xác nhận không trùng khớp, vui lòng nhập lại");
      return;
    }

    mutation.mutate({ email, password, confirmPassword });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ccc",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1 style={{ fontSize: "28px", fontWeight: "bold" }}> Xin chào</h1>
          <p style={{ fontSize: "18px" }}> Đăng nhập và tạo tài khoản</p>

          <Input
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => handleOnchangeEmail(e.target.value)}
            style={{
              height: "35px",
              width: "100%",
              marginBottom: "10px",
              padding: "8px 12px",
              boxSizing: "border-box",
            }}
          />

          <Input.Password
            placeholder="password"
            value={password}
            onChange={(e) => handleOnchangePassword(e.target.value)}
            style={{
              height: "35px",
              width: "100%",
              marginBottom: "10px",
              padding: "8px 12px",
              paddingRight: "10px",
              boxSizing: "border-box",
            }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: "black", marginRight: "-5px" }} />
              ) : (
                <EyeInvisibleOutlined
                  style={{ color: "black", marginRight: "-5px" }}
                />
              )
            }
          />

          <Input.Password
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => handleOnchangeConfirmPassword(e.target.value)}
            style={{
              height: "35px",
              width: "100%",
              marginBottom: "10px",
              padding: "8px 12px",
              paddingRight: "10px",
              boxSizing: "border-box",
            }}
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: "black", marginRight: "-5px" }} />
              ) : (
                <EyeInvisibleOutlined
                  style={{ color: "black", marginRight: "-5px" }}
                />
              )
            }
          />
          {data?.status === "ERR" && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {data.message}
            </span>
          )}
          <Loading isPending={isPending}>
            <BuyLogin
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
              text="Đăng ký"
            />
          </Loading>
          <p style={{ fontSize: "16px" }}>
            Bạn đã có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-logo"
            height="203px"
            width="203px"
          />
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "4px",
              color: "rgb(11, 116, 229)",
            }}
          >
            Mua sắm tại HealthCare+
          </h4>
          <h5
            style={{
              fontSize: "16px",
              textAlign: "center",
              marginTop: "0px",
              fontWeight: "normal",
              color: "rgb(11, 116, 229)",
            }}
          >
            Siêu ưu đãi mỗi ngày
          </h5>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
