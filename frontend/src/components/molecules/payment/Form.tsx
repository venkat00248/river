import React, { useContext, useState } from "react";
import PaymentContext, { usePaymentContext } from "./stateManagement/PaymentContext";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import { useFormData } from "./stateManagement/FormDataContext";
import { PaymentService } from "../../../services/PaymentService";
import AccountCircle from '@mui/icons-material/AccountCircle';
export const Form = () => {
  const { review, setReview } = useContext(PaymentContext);
  const {
    orderDetails,
    setOrderDetails,
    userDetails,
    mongoId,
    setMongoId,
    setUserDetails,
    location,
    setLocation,
    checked,
    setChecked
  } = useFormData();

  const [errors, setErrors] = useState({
    orderDetails: {orderId: "",
    amount: "",},
    userDetails: {
        name: "",
        email: "",
        contact: "",
    },
    location: {
        address: "",
        country: "",
        city: "",
        state: "",
        postalCode: "",
    },
  });
  // const [isChecked, setIsChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");
  
  // Other code (onBlur functions, handleSubmit, etc.)
  
  const handleCheckboxChange = (event:any) => {
    setChecked(event.target.checked);
    setCheckboxError("");
  };
  const onBlurOrderDetails = (fieldName:any) => () => {
    if (!orderDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        orderDetails: {
          ...prevErrors.orderDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        orderDetails: {
          ...prevErrors.orderDetails,
          [fieldName]: "",
        },
      }));
    }
  };

  const onBlurUserDetails = (fieldName:any) => () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } 
    else if (fieldName === "email" && !emailRegex.test(userDetails.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          email: "Invalid email format.",
        },
      }));
    }
    else if (fieldName === "contact" && userDetails.contact.length<9) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          contact: "Enter your 10 digits contact number",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          [fieldName]: "",
        },
      }));
    }
  };

  const onBlurLocation = (fieldName:any) => () => {
    if (!location[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: {
          ...prevErrors.location,
          [fieldName]: "This field is required.",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: {
          ...prevErrors.location,
          [fieldName]: "",
        },
      }));
    }
  };

  const handleSubmit = async (event:any) => {
    let isFormFieldValid = false;
    event.preventDefault();
    
  
    // Perform onBlur validation for all fields
    onBlurOrderDetails("orderId")();
    onBlurOrderDetails("amount")();
    onBlurUserDetails("name")();
    onBlurUserDetails("email")();
    onBlurUserDetails("contact")();
    onBlurLocation("address")();
    onBlurLocation("country")();
    onBlurLocation("city")();
    onBlurLocation("state")();
    onBlurLocation("postalCode")();
  
    // If there are any validation errors, prevent form submission
    if (
      errors.orderDetails.orderId ||
      errors.orderDetails.amount ||
      errors.userDetails.name ||
      errors.userDetails.email ||
      errors.userDetails.contact ||
      errors.location.address ||
      errors.location.country ||
      errors.location.city ||
      errors.location.state ||
      errors.location.postalCode 
    ) {
      // return;
      isFormFieldValid = false;
    } else {
      isFormFieldValid = true;
    }
    if (!checked) {
      setCheckboxError("You must agree to the terms and conditions.");
      // return; // Prevent form submission if checkbox is not checked
    } else {
      setCheckboxError(""); // Clear the checkbox error if it's checked
    }
    if(!isFormFieldValid || !checked) return;
    setReview(false)
    try {
      // Frame the formData object based on the form field values
      const formData = {
          ref_no: orderDetails.orderId,
          name: userDetails.name,
          city: location.city,
          amount: orderDetails.amount,
          country: location.country,
          contact_no: userDetails.contact,
          email: userDetails.email,
          address: location.address,
          payment_type: sessionStorage.paymentType ? sessionStorage.paymentType : location.state,
          postalCode: location.postalCode,
        }
      
      if (mongoId) {
        // Update the data with the received ID
        const updatedData = { updatePayload: formData, payment_id: mongoId};
        const encodedUpdatedData = btoa(JSON.stringify(updatedData));
        await PaymentService.paymentFormUpdate({data:encodedUpdatedData}); // Replace updateData with the function that updates the data
        // setReview(false);
        // Optionally, you can show a success message for updating data
      } else {
        const encodedFormData = btoa(JSON.stringify(formData));
        const postedData = await PaymentService.paymentFormSubmit({data:encodedFormData});
        const  decodedFormData = JSON.parse(atob(postedData.data.data))
        setMongoId(decodedFormData?.form?._id)
        // Handle the case where the server did not provide an ID after posting
      }
    } catch (error) {
      console.error("Error posting or updating data:", error);
      // Handle errors while posting or updating data
    }
  
  };
  
  return (
    
      <div
       
        className="register-form p-5 needs-validation"
        id="register-form"
      >
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Order Details</legend>
          <div className="control-group">
            <div className="row g-3">
              <div className="col-md-9">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Order ID / Quotation No / Invoice No / Company Name"
                    multiline
                    variant="outlined"
                    value={orderDetails.orderId}
                    onChange={(e) => {
                      const id = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '');
                      // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                      setOrderDetails({ ...orderDetails, orderId: id })}}
                    size="small"
                    onBlur={onBlurOrderDetails("orderId")}
                    error={!!errors.orderDetails.orderId}
                    helperText={errors.orderDetails.orderId}
                    inputProps={{ maxLength: 50 }}
                  />
                </FormControl>
              </div>
              <div className="col-md-3">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Amount"
                    multiline
                    variant="outlined"
                    value={orderDetails.amount}
                    // onChange={(e) => setOrderDetails({ ...orderDetails, amount: e.target.value })}
                    onChange={(e) => {
                      let amountValue = e.target.value.replace(/[^0-9.]/g, "");
                      const dotIndex = amountValue.indexOf(".");
                      if (dotIndex !== -1) {
                        // Allow only up to 2 characters after the dot
                        amountValue =
                          dotIndex + 3 <= amountValue.length
                            ? amountValue.slice(0, dotIndex + 3)
                            : amountValue;
                      }
                      setOrderDetails({ ...orderDetails, amount: amountValue });
                    }}
                    size="small"
                    onBlur={onBlurOrderDetails("amount")}
                    error={!!errors.orderDetails.amount}
                    helperText={errors.orderDetails.amount}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="scheduler-border">
          <legend className="scheduler-border">User Details</legend>
          <div className="control-group">
            <div className="row g-3">
              <div className="col-md-4">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Name"
                    multiline
                    variant="outlined"
                    value={userDetails.name}
                    // onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    onChange={(e) => {
                      const nameValue = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, "");
                      setUserDetails({ ...userDetails, name: nameValue });
                    }}
                    size="small"
                    onBlur={onBlurUserDetails("name")}
                    error={!!errors.userDetails.name}
                    helperText={errors.userDetails.name}
                    inputProps={{ maxLength: 50 }}
                  />
                </FormControl>
              </div>
              <div className="col-md-4">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Email"
                    multiline
                    variant="outlined"
                    value={userDetails.email}
                    onChange={(e) => {
                      const emailValue = e.target.value.replace(/[^a-zA-Z0-9@.]/g, "").replace(/\.com.*$/, ".com");
                      setUserDetails({ ...userDetails, email: emailValue });
                    }}
                    // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    size="small"
                    onBlur={onBlurUserDetails("email")}
                    error={!!errors.userDetails.email}
                    helperText={errors.userDetails.email}
                    inputProps={{ maxLength: 50 }}
                  />
                </FormControl>
              </div>
              <div className="col-md-4">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Contact"
                    multiline
                    variant="outlined"
                    value={userDetails.contact}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          +91
                        </InputAdornment>
                      ),
                    }}
                    // onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })}
                    onChange={(e) => {
                      const contactValue = e.target.value.replace(/^0+|[^0-9]/g, "");

                      // const contactValue = e.target.value.replace(/^[0]+([0-9]*)$/, "$1");
                      // const contactValue = e.target.value.replace(/[^0-9]/g, "");
                      setUserDetails({ ...userDetails, contact: contactValue });
                    }}
                    size="small"
                    onBlur={onBlurUserDetails("contact")}
                    error={!!errors.userDetails.contact}
                    helperText={errors.userDetails.contact}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Location</legend>
          <div className="control-group">
            <div className="row g-3">
              <div className="col-md-6">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Address"
                    multiline
                    variant="outlined"
                    value={location.address} 
                    // onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    onChange={(e) => {
                      const addressValue = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 /,-]/g, "");
                      setLocation({ ...location, address: addressValue })}}
                    size="small"
                    onBlur={onBlurLocation("address")}
                    error={!!errors.location.address}
                    helperText={errors.location.address}
                    inputProps={{ maxLength: 100}}
                  />
                </FormControl>
                </div>
                <div className="col-md-6">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Country"
                    multiline
                    variant="outlined"
                    value={location.country}
                    onChange={(e) => {
                      const countryValue = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z ]/g, "");
                      setLocation({ ...location, country: countryValue })}}
                    size="small"
                    onBlur={onBlurLocation("country")}
                    error={!!errors.location.country}
                    helperText={errors.location.country}
                    inputProps={{ maxLength: 50 }}
                  />
                </FormControl>
              </div>
              <div className="col-md-4">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="City"
                    multiline
                    variant="outlined"
                    value={location.city}
                    onChange={(e) => {
                      const cityValue = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      setLocation({ ...location, city: cityValue })}}
                    size="small"
                    onBlur={onBlurLocation("city")}
                    error={!!errors.location.city}
                    helperText={errors.location.city}
                    inputProps={{ maxLength: 50 }}
                  />
                </FormControl>
              </div>
              <div className="col-md-4">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="State"
                    multiline
                    variant="outlined"
                    value={location.state}
                    onChange={(e) => {
                      const stateValue = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z ]/g, "");
                      setLocation({ ...location, state: stateValue })}}
                    size="small"
                    onBlur={onBlurLocation("state")}
                    error={!!errors.location.state}
                    helperText={errors.location.state}
                    inputProps={{ maxLength: 50 }}
                  />
                </FormControl>
              </div>
              <div className="col-md-4">
                <FormControl sx={{ m: 1, width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    label="Postal Code"
                    multiline
                    variant="outlined"
                    value={location.postalCode}
                    onChange={(e) => {
                      const postalValue = e.target.value.replace(/[^0-9]/g, "");
                      setLocation({ ...location, postalCode: postalValue})
                    }}
                    size="small"
                    onBlur={onBlurLocation("postalCode")}
                    error={!!errors.location.postalCode}
                    helperText={errors.location.postalCode}
                     inputProps={{ maxLength: 6 }}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </fieldset>
        <div className="row">
          <div className="col-md-12">
            <div className="checkboxInput">
              <input type="checkbox" name="tos" id="tos" value="terms" checked={checked} onChange={handleCheckboxChange}/>
              <p>
                I agree to the{" "}
                <a href="https://www.cloud4c.com/terms">terms and conditions</a>{" "}
                mentioned in the <a href="https://www.cloud4c.com/aup">AUP</a>,{" "}
                <a href="https://www.cloud4c.com/msa">MSA</a>,{" "}
                <a href="https://www.cloud4c.com/sla">SLA</a>.
              </p>
            </div>
            {checkboxError && <span style={{ color: "#d32f2f" , marginLeft:"25px" }}>{checkboxError}</span>}
          </div>
        </div>
        <div className="col-12">
          <div className="submit">
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              <span>Proceed</span>
            </button>
          </div>
        </div>
      </div>
  );
};
