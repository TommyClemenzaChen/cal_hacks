import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(sender_email = 'hyperbolicproject54@gmail.com', receiver_email = 'bobthebusailer@gmail.com', 
               subject = 'Medical Advice', body = 'testing', smtp_server = 'smtp.gmail.com', smtp_port = 587, sender_password = 'xdzs emvq jxcc cxis'):
    # Create a multipart message
    try:
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = receiver_email
        message['Subject'] = subject

        # Add the email body to the message
        message.attach(MIMEText(body, 'plain'))

        # Set up the SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)

        # Send the email
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
    except Exception as e:
        print(f"Error in sending email: {e}")
    

if __name__ == "__main__":
    # Replace with your details
    sender_email = "your_email@gmail.com"
    receiver_email = "receiver_email@example.com"
    subject = "Test Email"
    body = "Hello, this is a test email sent using Python!"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_password = "your_email_password"

    send_email(sender_email, receiver_email, subject, body, smtp_server, smtp_port, sender_password)
