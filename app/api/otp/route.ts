import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import { database } from "@/firebase";
import { get, ref, set } from "firebase/database";
import { User } from "firebase/auth";

// Utility function to generate a 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Function to send the OTP to the user's email
async function sendEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // You can use your email service provider here (e.g., Gmail, SendGrid, etc.)
        auth: {
            user: process.env.SMTP_ADDRESS, // Your email
            pass: process.env.SMTP_PASSWORD,  // Your email password or app password
        },
    });

    const mailOptions = {
        from: process.env.SMTP_ADDRESS,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email.');
    }
}

async function pushOTP(otp: string, expiration: number, id: string): Promise<void> {
    const otpRef = ref(database, `otpRequests/${id}`);  // Path to store OTPs for a specific user (id)

    const snapshot = await get(otpRef);

    if (snapshot.exists()) {
        // OTP exists, update it
        await set(otpRef, {
            OTP: otp,
            timestamp: expiration,
        });
        console.log('OTP updated successfully');
    } else {
        // No OTP found, set a new OTP
        await set(otpRef, {
            OTP: otp,
            timestamp: expiration,
        });
        console.log('OTP added successfully');
    }
}

// Function to store the OTP in memory and set expiration
async function storeOtp(email: string, id: string): Promise<void> {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    // Send the OTP to the user's email
    await sendEmail(email, otp);

    //get the id
    await pushOTP(otp, expiresAt, id);
}

async function checkEmail(email: string): Promise<{ id: string; data: any } | null> {
    const emailRef = ref(database, 'users');  // Adjust path if necessary
    const snapshot = await get(emailRef);

    if (snapshot.exists()) {
        const users = snapshot.val();

        // Iterate through entries to find a match and return both ID and data
        for (const [key, user] of Object.entries(users)) {
            const userData = user as User;  // Type assertion here
            if (userData.email === email) {
                return { id: key, data: userData };  // Return the user ID and data
            }
        }
    }

    return null;
}

export async function POST(req: Request) {
    const body = await req.json();
    const { values } = body;

    try {
        const emailExists = await checkEmail(values.email);

        if (!emailExists) {
            return NextResponse.json({ status: 404, message: 'Email not found in the system.' });
        }

        // Generate OTP and send email to the user
        await storeOtp(values.email, emailExists.id);  // Store OTP in memory and send it
        return NextResponse.json({ status: 200, message: 'OTP sent successfully.', id: emailExists.id });
    } catch (error) {
        console.error('Error generating OTP:', error);
        return NextResponse.json({ status: 500, message: 'Failed to send OTP. Please try again.' });
    }
}