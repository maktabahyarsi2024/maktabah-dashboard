const handleError = (error) => {
    if (error.response.data.msg === "jwt expired") {
      window.location.href = "/signin";
      localStorage.removeItem("auth");
    }
  
    return error;
  };
  
  export default handleError;
  