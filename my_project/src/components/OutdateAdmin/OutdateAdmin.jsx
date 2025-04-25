import React, { useEffect, useRef, useState } from "react";
import { WrapperHeaderAdmin, WrapperUploadFile } from "./style";
import { Button, Form, Input, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { Loading } from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBase64 } from "../../utils";
import * as message from "../Message/Message";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ThanhlyServices from "../../services/ThanhlyService";

function formatCurrency(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(number);
}

const OutdateAdmin = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelelte] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks((data) => {
    console.log("data", data);
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, rests, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("users"); // Làm mới danh sách sản phẩm sau khi update
        },
      }
    );
  };

  const mutationDeleted = useMutationHooks((data) => {
    console.log("data", data);
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const getAllUsers = async () => {
    const res = await ThanhlyServices.getAllThanhly();
    console.log("res", res);
    return res.data;
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        isAdmin: res.data.isAdmin,
        address: res.data.address,
        avatar: res.data.avatar,
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails); // Sửa thành setFieldsValue
    // console.log("StateProduct", stateProductDetails);
  }, [form, stateUserDetails]);

  const handleDetailsProduct = () => {
    if (rowSelected) {
      setIsPendingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
    setIsOpenDrawer(true);
  };

  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const { isPending: isPendingUsers, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelelte(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "28px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const cellValue = record[dataIndex];
      return cellValue
        ? cellValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },

    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => {
        const nameA = a.name ? a.name.length : 0; // Kiểm tra a.name
        const nameB = b.name ? b.name.length : 0; // Kiểm tra b.name
        return nameA - nameB;
      },
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      // sorter: (a, b) => a > b,
      // ...getColumnSearchProps("price"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      // sorter: (a, b) => a > b,
      // ...getColumnSearchProps("discount"),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      // sorter: (a, b) => a.length - b.length,
      // ...getColumnSearchProps("reason"),
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        price: formatCurrency(user.price),
        discount: `${user.discount}%`,
      };
    });

  // useEffect(() => {
  //   if (isSuccessDeleted && dataDeleted?.status === "OK") {
  //     message.success();
  //     handleCancelDelete();
  //   } else if (isErrorDeleted) {
  //     message.error();
  //   }
  // }, [isSuccessDeleted]);

  // useEffect(() => {
  //   if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
  //     message.success();
  //   } else if (isErrorDeletedMany) {
  //     message.error();
  //   }
  // }, [isSuccessDeletedMany]);

  // const handleCloseDrawer = () => {
  //   setIsOpenDrawer(false);
  //   setStateUserDetails({
  //     name: "",
  //     email: "",
  //     phone: "",
  //     isAdmin: false,
  //   });
  //   form.resetFields();
  // };

  // useEffect(() => {
  //   if (isSuccessUpdated && dataUpdated?.status === "OK") {
  //     message.success();
  //     handleCloseDrawer();
  //   } else if (isErrorUpdated) {
  //     message.error();
  //   }
  // }, [isSuccessUpdated]);

  // const handleCancelDelete = () => {
  //   setIsModalOpenDelelte(false);
  // };

  // const handleDeleteUser = () => {
  //   mutationDeleted.mutate(
  //     { id: rowSelected, token: user?.access_token },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries("users"); // Làm mới danh sách sản phẩm sau khi update
  //       },
  //     }
  //   );
  // };

  // const handleOnChangeDetails = (e) => {
  //   setStateUserDetails((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  // const handleOnChangeAvatarDetails = async (fileList) => {
  //   if (!fileList.length) return;
  //   const file = fileList[0];
  //   if (!file.originFileObj) return;

  //   file.preview = await getBase64(file.originFileObj);
  //   setStateUserDetails((prev) => ({
  //     ...prev,
  //     avatar: file.preview,
  //   }));
  // };

  const queryClient = useQueryClient(); // Lấy instance của queryClient

  // const onUpdateUser = () => {
  //   mutationUpdate.mutate(
  //     {
  //       id: rowSelected,
  //       token: user?.access_token,
  //       ...stateUserDetails,
  //     },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries("users"); // Làm mới danh sách sản phẩm sau khi update
  //       },
  //     }
  //   );
  // };
  return (
    <div>
      <WrapperHeaderAdmin>Quản lý sản phẩm hết hạn</WrapperHeaderAdmin>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUsers}
          columns={columns}
          isPending={isPendingUsers}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default OutdateAdmin;
