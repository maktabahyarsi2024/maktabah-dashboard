import axios from "axios";
import handleError from "./handleError";

export async function postData(url, payload, formData) {
    try {
      const { token } = localStorage.getItem("auth")
        ? JSON.parse(localStorage.getItem("auth"))
        : {};
  
      return await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": formData ? "multipart/form-data" : "application/json",
        },
      });
    } catch (err) {
      return handleError(err);
    }
  }