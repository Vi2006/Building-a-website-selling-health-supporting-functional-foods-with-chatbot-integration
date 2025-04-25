import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
  selected: [],
};

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );
      if (itemOrder) {
        itemOrder.amount += orderItem?.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    removeOrderProduct: (state, action) => {
      const thutu = action.payload;
      const itemOrder = state?.orderItems?.filter(
        (item, index) => index !== thutu
      );
      state.orderItems = itemOrder;
    },
    updateSelected: (state, action) => {
      state.selected = action.payload;
    },
    updateProductArr: (state, action) => {
      state.orderItems = action.payload;
    },
  },
});

export const {
  addOrderProduct,
  updateSelected,
  removeOrderProduct,
  updateProductArr,
} = orderSlide.actions;

export default orderSlide.reducer;
