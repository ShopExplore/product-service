import axios from "axios";

export const publishCustomerEvent = async (payload: { [key: string]: any }) => {
  const { data } = await axios.post("http://localhost:9001/v1/customer-event", {
    payload,
  });

  return data;
};
