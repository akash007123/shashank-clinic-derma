
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.json()); // Use express built-in JSON parser

const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-password";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";

// Log environment variables for debugging
console.log("Email User:", EMAIL_USER);
console.log("Admin Email:", ADMIN_EMAIL);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.post("/send-mail", async (req, res) => {
  console.log("Received request:", req.body); // Debugging log

  const { Name, Email, Mobile, Date, Time, Service } = req.body;

  if (!Name || !Email || !Mobile || !Date || !Time || !Service) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const userMailOptions = {
    from: EMAIL_USER,
    to: Email,
    subject: "✅ Appointment Confirmation – Shashank Bhargawa Clinic",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2E86C1; text-align: center;">Appointment Confirmation</h2>
        <p>Dear <strong>${Name}</strong>,</p>
        <p>Thank you for scheduling your appointment with <strong>Shashank Bhargawa Clinic</strong>. We are pleased to confirm the details:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>🩺 Service:</strong> ${Service}</p>
          <p><strong>📅 Date:</strong> ${Date}</p>
          <p><strong>⏰ Time:</strong> ${Time}</p>
          <p><strong>📍 Location:</strong> MPEB Office, Opposite Gate No. 4, Madhav Nagar, Ujjain, Madhya Pradesh 456010</p>
          <p><strong>👨‍⚕️ Doctor:</strong> Dr. Shashank Bhargawa</p>
        </div>
        <p>Please arrive at least <strong>10 minutes</strong> before your scheduled appointment. If you need to reschedule or cancel, feel free to contact us.</p>
        <p style="margin-top: 20px;"><strong>📞 Contact:</strong> <a href="tel:+919479949923">+91 9479949923</a></p>
        <p><strong>📧 Email:</strong> <a href="mailto:shashankhargawa@gmail.com">shashankhargawa@gmail.com</a></p>
        <p><strong>🌐 Website:</strong> <a href="https://shashankbhargavaclinic.netlify.app/" target="_blank">shashankbhargavaclinic</a></p>
        <p>We look forward to seeing you!</p>
        <p style="margin-top: 20px;"><strong>Best Regards,</strong></p>
        <p><strong>Shashank Bhargawa Clinic</strong></p>
      </div>
    `,
  };
  

  const adminMailOptions = {
    from: EMAIL_USER,
    to: ADMIN_EMAIL,
    subject: "📅 New Appointment Booking - Tripod Wellness",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d35400; text-align: center;">New Appointment Booking</h2>
        <p>A new appointment has been booked. Here are the details:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>👤 Name:</strong> ${Name}</p>
          <p><strong>📧 Email:</strong> ${Email}</p>
          <p><strong>📞 Phone:</strong> ${Mobile}</p>
          <p><strong>📅 Date:</strong> ${Date}</p>
          <p><strong>⏰ Time:</strong> ${Time}</p>
          <p><strong>💆 Service:</strong> ${Service}</p>
        </div>
        <p>Please review and confirm the appointment.</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>Tripod Wellness Team</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #777;">For inquiries, contact us at <a href="mailto:shashankhargawa@gmail.com">shashankhargawa@gmail.com</a> <a href="tel:+919479949923">9479949923</a></p>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log("Emails sent successfully.");
    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
