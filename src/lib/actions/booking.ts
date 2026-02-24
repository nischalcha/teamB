'use server';

import nodemailer from 'nodemailer';
import { getCurrentUser } from '@/lib/auth';

export interface BookingResult {
  success: boolean;
  message: string;
}

export async function submitBookingAction(formData: FormData): Promise<BookingResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'You must be logged in to book a court.' };
  }

  const location = formData.get('location') as string;
  const courtType = formData.get('courtType') as string;
  const preferredDate = formData.get('preferredDate') as string;
  const preferredTime = formData.get('preferredTime') as string;
  const level = formData.get('level') as string;
  const notes = formData.get('notes') as string;

  if (!location || !courtType || !preferredDate || !preferredTime) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  const bookingEmail = process.env.BOOKING_EMAIL || 'moku.nackle@gmail.com';

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #059669; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Flash Sports Academy</h1>
        <p style="color: #d1fae5; margin: 5px 0 0;">New Court Booking Request</p>
      </div>
      <div style="padding: 24px; border: 1px solid #e4e4e7; border-top: none;">
        <h2 style="color: #18181b; margin-top: 0;">Booking Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #71717a; width: 140px;">Name:</td>
            <td style="padding: 8px 0; color: #18181b; font-weight: 600;">${user.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Email:</td>
            <td style="padding: 8px 0; color: #18181b;">${user.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Location:</td>
            <td style="padding: 8px 0; color: #18181b; font-weight: 600;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Court Type:</td>
            <td style="padding: 8px 0; color: #18181b;">${courtType === 'clay' ? 'Clay Court' : 'Mini Court'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Preferred Date:</td>
            <td style="padding: 8px 0; color: #18181b;">${new Date(preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Preferred Time:</td>
            <td style="padding: 8px 0; color: #18181b;">${preferredTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Skill Level:</td>
            <td style="padding: 8px 0; color: #18181b;">${level || 'Not specified'}</td>
          </tr>
          ${notes ? `
          <tr>
            <td style="padding: 8px 0; color: #71717a; vertical-align: top;">Notes:</td>
            <td style="padding: 8px 0; color: #18181b;">${notes}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      <div style="padding: 16px; background-color: #f4f4f5; text-align: center; font-size: 12px; color: #71717a;">
        Sent from Flash Sports Academy Booking System
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Flash Sports Academy" <${process.env.SMTP_USER || 'noreply@flashsports.com'}>`,
      to: bookingEmail,
      subject: `Court Booking Request - ${user.name} (${location})`,
      html: emailHtml,
    });

    return { success: true, message: 'Booking request sent successfully! We will get back to you shortly.' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      message: 'Failed to send booking request. Please try again or contact us directly.',
    };
  }
}
