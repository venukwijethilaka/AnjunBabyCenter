export const getBaseEmailTemplate = (title: string, contentHTML: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .header {
            background-color: #ffffff;
            padding: 40px 40px 20px;
            text-align: center;
            border-bottom: 2px solid #f1f5f9;
        }
        .logo-text {
            font-size: 28px;
            font-weight: 900;
            color: #0ea5e9;
            letter-spacing: -0.5px;
            margin: 0;
            text-transform: uppercase;
        }
        .logo-subtext {
            font-size: 12px;
            font-weight: 700;
            color: #94a3b8;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 4px;
        }
        .content {
            padding: 40px;
            color: #334155;
            line-height: 1.6;
            font-size: 16px;
        }
        h1 {
            color: #0f172a;
            font-size: 24px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 24px;
        }
        .otp-box {
            background-color: #f0f9ff;
            border: 2px dashed #bae6fd;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin: 32px 0;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 900;
            color: #0284c7;
            letter-spacing: 8px;
            margin: 0;
        }
        .footer {
            background-color: #f8fafc;
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 0;
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .status-PENDING { background-color: #fef3c7; color: #d97706; }
        .status-ARRANGING { background-color: #e0f2fe; color: #0284c7; }
        .status-SHIPPING { background-color: #e0e7ff; color: #4338ca; }
        .status-DELIVERED { background-color: #dcfce3; color: #16a34a; }
        .status-CANCELLED { background-color: #ffe4e6; color: #e11d48; }
        
        .order-details {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 24px;
            margin: 32px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .detail-label {
            color: #64748b;
            font-weight: 600;
            font-size: 14px;
        }
        .detail-value {
            color: #0f172a;
            font-weight: 800;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1 class="logo-text">Anjun Baby</h1>
                <div class="logo-subtext">Premium Care</div>
            </div>
            <div class="content">
                ${contentHTML}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Anjun Baby Center. All rights reserved.</p>
                <p style="margin-top: 8px; color: #94a3b8;">If you didn't request this email, you can safely ignore it.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const getOtpEmailHTML = (otp: string, isReset: boolean = false) => {
    const title = isReset ? "Reset Your Password" : "Verify Your Email";
    const header = isReset ? "Password Reset" : "Welcome to Anjun Baby Center!";
    const description = isReset
        ? "We received a request to reset the password for your account. Use the verification code below to proceed."
        : "Thank you for joining us! Please use the verification code below to complete your registration.";

    const content = `
        <h1>${header}</h1>
        <p>${description}</p>
        
        <div class="otp-box">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
        </div>
        
        <p style="margin-top: 32px;">This code is valid for 10 minutes. Please do not share this code with anyone.</p>
    `;

    return getBaseEmailTemplate(title, content);
};

export const getOrderStatusEmailHTML = (orderId: number, status: string, trackingId?: string) => {
    const title = `Order #${orderId} Status Update`;
    const header = `Update on Order #${orderId}`;

    let message = "The status of your recent order has been updated.";
    if (status === 'SHIPPING') message = "Great news! Your order is now on its way to you.";
    if (status === 'DELIVERED') message = "Your order has been successfully delivered. We hope you love your purchase!";
    if (status === 'CANCELLED') message = "Your order has been cancelled.";

    const content = `
        <h1>${header}</h1>
        <p>${message}</p>
        
        <div class="order-details">
            <div class="detail-row">
                <span class="detail-label">Order Number</span>
                <span class="detail-value">#${orderId}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Current Status</span>
                <span class="status-badge status-${status}">${status}</span>
            </div>
            ${trackingId ? `
            <div class="detail-row" style="margin-top: 16px; padding-top: 16px;">
                <span class="detail-label">Tracking ID</span>
                <span class="detail-value" style="color: #0ea5e9;">${trackingId}</span>
            </div>
            ` : ''}
        </div>
        
        <p style="margin-top: 32px;">You can view the full details of your order by logging into your account on our website.</p>
    `;

    return getBaseEmailTemplate(title, content);
};
