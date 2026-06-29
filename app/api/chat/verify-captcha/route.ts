import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { success: false, error: "CAPTCHA token is required" },
                { status: 400 }
            );
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error("RECAPTCHA_SECRET_KEY not configured");
            return NextResponse.json(
                { success: false, error: "CAPTCHA not configured" },
                { status: 500 }
            );
        }

        // Verify token with Google reCAPTCHA API
        const verifyResponse = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
            }
        );

        const verifyData = await verifyResponse.json();

        // Check if verification was successful
        if (!verifyData.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "CAPTCHA verification failed",
                    details: verifyData["error-codes"],
                },
                { status: 400 }
            );
        }

        // Check score (reCAPTCHA v3 returns a score from 0.0 to 1.0)
        const score = verifyData.score || 0;
        const threshold = 0.5; // Configurable threshold

        if (score < threshold) {
            return NextResponse.json(
                {
                    success: false,
                    error: "CAPTCHA score too low",
                    score,
                },
                { status: 400 }
            );
        }

        // Verification successful
        return NextResponse.json({
            success: true,
            score,
        });
    } catch (error) {
        console.error("CAPTCHA verification error:", error);
        return NextResponse.json(
            { success: false, error: "CAPTCHA verification failed" },
            { status: 500 }
        );
    }
}
