import React from "react";
import "./ContactUs.css";
import MoocowLogo from "../../images/mooCowLogo.png";

function ContactUs() {
  return (
    <div className="contact-us">
      <div className="container" id="contactusbox">
        <div style={{ textAlign: "center" }}>
          <h2>Contact Us</h2>
        </div>
        <div className="cowandform">
          <div className="cowpicturecontactpage">
            <img
              className="sleepingcowlogo"
              src={MoocowLogo}
              alt="sleepingcowlogo"
              style={{ width: "100%" }}
            />
          </div>
          <form action="/userprofile" className="formdetails">
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              id="fname"
              name="firstname"
              placeholder="Your name.."
            />
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              id="lname"
              name="lastname"
              placeholder="Your last name.."
            />
            <label htmlFor="subject">Subject</label>
            <textarea
              id="subject"
              name="subject"
              placeholder="Write something.."
              style={{ height: "170px" }}
            ></textarea>
            <input
              type="submit"
              value="Submit"
              className="contactus-submitbutton"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
