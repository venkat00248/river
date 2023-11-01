import React from 'react'

export const Cheque = () => {
  const handleSendEmail = () => {
    // Open the default email client with the pre-filled email
    window.open('mailto:billing@cloud4c.com');
  };
  return (
    <div className="register-form p-5 needs-validation h-70" id="register-form" >
    <div className="p-2 mt-5 border d-flex justify-content-between rounded pb-5">
                 
      <h2>Send your Cheque / Bank NEFT/RTGS details to cloud4c billing team.</h2>
          
       </div>

      <div className="col-12">
          <div className="submit ftright"><button type="submit" className="btn btn-primary"onClick={handleSendEmail}> <span>Send Email</span></button></div>
        </div>

  </div>
  )
}
