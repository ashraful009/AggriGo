import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send Agreement PDF Email (First submission)
 * @param {String} email - User email
 * @param {String} name - User name
 * @param {Buffer} pdfBuffer - PDF buffer
 * @param {String} language - 'en' or 'bn'
 */
export const sendAgreementPDF = async (email, name, pdfBuffer, language = 'en') => {
  try {
    const transporter = createTransporter();

    const isBangla = language === 'bn';

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'SRIJON Platform <noreply@srijon.com>',
      to: email,
      subject: isBangla 
        ? 'চুক্তি সম্পন্ন হয়েছে – SRIJON প্ল্যাটফর্ম' 
        : 'Agreement Confirmation – SRIJON Platform',
      html: isBangla ? getBanglaAgreementEmailHTML(name) : getEnglishAgreementEmailHTML(name),
      attachments: [
        {
          filename: `Agreement_${name.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Agreement PDF email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Agreement PDF email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get English Agreement Email HTML
 */
const getEnglishAgreementEmailHTML = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success { background-color: #d1fae5; border: 2px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .button { display: inline-block; padding: 14px 32px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .attachment-icon { font-size: 48px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.95;">Your Registration is Complete</p>
        </div>
        <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
          
          <div class="success">
            <div class="attachment-icon">📄</div>
            <strong style="font-size: 18px; color: #22c55e;">Your Entrepreneur Participation Agreement is Attached!</strong>
            <p style="margin: 10px 0 0 0; color: #666;">This agreement confirms your registration with the SRIJON platform.</p>
          </div>

          <p>Thank you for completing your business registration with SRIJON! Your Entrepreneur Participation Agreement has been generated and attached to this email.</p>
          
          <p><strong>What's Next?</strong></p>
          <ul style="line-height: 1.8;">
            <li>Review the attached agreement document</li>
            <li>Keep this document for your records</li>
            <li>Access your dashboard to manage your business profile</li>
            <li>Download a fresh copy anytime from your dashboard</li>
          </ul>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">View Dashboard →</a>
          </p>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #666;">
            <strong>💡 Note:</strong> You can download the agreement PDF anytime from your dashboard using the "Download Agreement PDF" button.
          </p>
          
          <p style="margin-top: 20px;">Best regards,<br><strong>The SRIJON Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SRIJON Platform. All rights reserved.</p>
          <p>This email was sent because you completed your registration on the SRIJON platform.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Get Bangla Agreement Email HTML
 */
const getBanglaAgreementEmailHTML = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success { background-color: #d1fae5; border: 2px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .button { display: inline-block; padding: 14px 32px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .attachment-icon { font-size: 48px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">🎉 অভিনন্দন!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.95;">আপনার নিবন্ধন সম্পন্ন হয়েছে</p>
        </div>
        <div class="content">
          <p>প্রিয় <strong>${name}</strong>,</p>
          
          <div class="success">
            <div class="attachment-icon">📄</div>
            <strong style="font-size: 18px; color: #22c55e;">আপনার উদ্যোক্তা অংশগ্রহণ চুক্তি সংযুক্ত করা আছে!</strong>
            <p style="margin: 10px 0 0 0; color: #666;">এই চুক্তি SRIJON প্ল্যাটফর্মে আপনার নিবন্ধন নিশ্চিত করে।</p>
          </div>

          <p>SRIJON-এ আপনার ব্যবসা নিবন্ধন সম্পন্ন করার জন্য ধন্যবাদ! আপনার উদ্যোক্তা অংশগ্রহণ চুক্তি তৈরি করা হয়েছে এবং এই ইমেইলে সংযুক্ত করা হয়েছে।</p>
          
          <p><strong>পরবর্তী পদক্ষেপ:</strong></p>
          <ul style="line-height: 1.8;">
            <li>সংযুক্ত চুক্তি নথি পর্যালোচনা করুন</li>
            <li>আপনার রেকর্ডের জন্য এই নথি সংরক্ষণ করুন</li>
            <li>আপনার ব্যবসায়িক প্রোফাইল পরিচালনা করতে আপনার ড্যাশবোর্ড দেখুন</li>
            <li>যেকোনো সময় আপনার ড্যাশবোর্ড থেকে একটি নতুন কপি ডাউনলোড করুন</li>
          </ul>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">ড্যাশবোর্ড দেখুন →</a>
          </p>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #666;">
            <strong>💡 নোট:</strong> আপনি যেকোনো সময় আপনার ড্যাশবোর্ড থেকে "চুক্তিপত্র PDF ডাউনলোড করুন" বোতাম ব্যবহার করে চুক্তি PDF ডাউনলোড করতে পারবেন।
          </p>
          
          <p style="margin-top: 20px;">শুভেচ্ছা,<br><strong>SRIJON টিম</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SRIJON প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>আপনি SRIJON প্ল্যাটফর্মে নিবন্ধন সম্পন্ন করেছেন বলে এই ইমেইলটি পাঠানো হয়েছে।</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Keep all existing email functions (sendPasswordResetEmail, sendWelcomeEmail, etc.)
// ... (rest of the file remains unchanged)
