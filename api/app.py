from flask import Flask, request, jsonify, send_from_directory
import os
import requests
import cloudinary
import cloudinary.uploader
from flask_cors import CORS
from sqlmodel import SQLModel, create_engine, Session, select
from dotenv import dotenv_values
from productModel import Product, ProductCreate, ProductResponse
from userModel import (
    User,
    UserCreate,
    UserLogin,
    UserResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from decimal import Decimal
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt
from functools import wraps

app = Flask(__name__)

CORS(
    app,
    origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "https://pernulo.ftdalpha.com",
    ],
    supports_credentials=True,
)

config = dotenv_values(".env")
DATABASE_URL = config.get("DATABASE_URL", "sqlite:///products.db")
SECRET_KEY = config.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in .env file")
engine = create_engine(DATABASE_URL, echo=False)

# Cloudinary Configuration

cloudinary.config(
    cloud_name=config.get("CLOUDINARY_CLOUD_NAME"),
    api_key=config.get("CLOUDINARY_API_KEY"),
    api_secret=config.get("CLOUDINARY_API_SECRET"),
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


# JWT Authentication


def generate_token(user_id: int, email: str, is_admin: bool = False) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "is_admin": is_admin,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing", "code": "NO_TOKEN"}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired", "code": "TOKEN_EXPIRED"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token", "code": "INVALID_TOKEN"}), 401

        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing", "code": "NO_TOKEN"}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if not payload.get("is_admin"):
                return (
                    jsonify({"error": "Admin access required", "code": "NOT_ADMIN"}),
                    403,
                )
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired", "code": "TOKEN_EXPIRED"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token", "code": "INVALID_TOKEN"}), 401

        return f(*args, **kwargs)

    return decorated


# Image Upload

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "avif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_image(file, folder="products"):
    if folder not in ["products", "profile"]:
        raise ValueError("folder must be 'products' or 'profile'")

    result = cloudinary.uploader.upload(
        file, folder=f"pernulo/{folder}", resource_type="image"
    )
    return result["secure_url"]


#  Product Routes


@app.route("/api/products", methods=["GET"])
def get_products():
    with Session(engine) as session:
        products = session.exec(select(Product)).all()

        results = []
        for p in products:
            response = ProductResponse.model_validate(p)
            data = response.model_dump()
            results.append(data)

        return jsonify(results)


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    with Session(engine) as session:
        product = session.get(Product, product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(ProductResponse.model_validate(product).model_dump())


@app.route("/api/products", methods=["POST"])
@admin_required
def create_product():
    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()

        product_name = data.get("product_name")
        quantity_in_stock = data.get("quantity_in_stock")
        original_price = data.get("original_price")
        discount = data.get("discount", "0.00")
        gemstone = data.get("gemstone")
        materials = data.get("materials")
        size = data.get("size")
        description = data.get("description")

        if not product_name:
            return jsonify({"error": "product_name is required"}), 400
        if not quantity_in_stock:
            return jsonify({"error": "quantity_in_stock is required"}), 400
        if not original_price:
            return jsonify({"error": "original_price is required"}), 400

        quantity_in_stock = int(quantity_in_stock)
        original_price = Decimal(original_price)
        discount = Decimal(discount)

        image_paths = []
        if "images" in request.files:
            files = request.files.getlist("images")
            for file in files:
                if file.filename != "" and allowed_file(file.filename):
                    image_paths.append(save_image(file))

        if request.is_json and data.get("image_paths"):
            image_paths.extend(data["image_paths"])

        with Session(engine) as session:
            product = Product(
                product_name=product_name,
                quantity_in_stock=quantity_in_stock,
                original_price=original_price,
                discount=discount,
                image_paths=image_paths,
                gemstone=gemstone,
                materials=materials,
                size=size,
                description=description,
            )

            product.calculate_discounted_price()

            session.add(product)
            session.commit()
            session.refresh(product)

            return jsonify(ProductResponse.model_validate(product).model_dump()), 201

    except ValueError as e:
        print("ERROR:", str(e))
        import traceback

        traceback.print_exc()
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400

    except Exception as e:
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/products/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(product_id):
    try:
        with Session(engine) as session:
            product = session.get(Product, product_id)
            if not product:
                return jsonify({"error": "Product not found"}), 404

            if request.is_json:
                data = request.get_json()
            else:
                data = request.form.to_dict()

            if data.get("product_name"):
                product.product_name = data["product_name"]
            if data.get("quantity_in_stock") not in [None, ""]:
                product.quantity_in_stock = int(data["quantity_in_stock"])
            if data.get("original_price"):
                product.original_price = Decimal(str(data["original_price"]))
            if data.get("discount") is not None:
                product.discount = Decimal(str(data["discount"]))
            if data.get("image_paths"):
                product.image_paths = data["image_paths"]
            if data.get("gemstone") is not None:
                product.gemstone = data["gemstone"]
            if data.get("materials") is not None:
                product.materials = data["materials"]
            if data.get("size") is not None:
                product.size = data["size"]
            if data.get("description") is not None:
                product.description = data["description"]

            if "images" in request.files:
                files = request.files.getlist("images")
                new_paths = list(product.image_paths or [])
                for file in files:
                    if file.filename != "" and allowed_file(file.filename):
                        new_paths.append(save_image(file))
                product.image_paths = new_paths

            product.calculate_discounted_price()

            session.add(product)
            session.commit()
            session.refresh(product)

            return jsonify(ProductResponse.model_validate(product).model_dump()), 200

    except Exception as e:
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/products/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):
    try:
        with Session(engine) as session:
            product = session.get(Product, product_id)
            if not product:
                return jsonify({"error": "Product not found"}), 404

            session.delete(product)
            session.commit()

            return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


#  User Routes


@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = UserCreate.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == data.email)).first()
        if existing:
            if existing.auth_provider == "google":
                return (
                    jsonify(
                        {
                            "error": "This email is already registered with Google.",
                            "code": "EMAIL_EXISTS_GOOGLE",
                        }
                    ),
                    400,
                )
            else:
                return (
                    jsonify(
                        {
                            "error": "This email is already registered.",
                            "code": "EMAIL_EXISTS",
                        }
                    ),
                    400,
                )

        user = User(email=data.email, name=data.name, auth_provider="local")
        user.set_password(data.password)
        session.add(user)
        session.commit()
        session.refresh(user)

        token = generate_token(user.id, user.email, user.is_admin)

        response = UserResponse.model_validate(user).model_dump()
        response["token"] = token

        return jsonify(response), 201


@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = UserLogin.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()

        if not user:
            return (
                jsonify(
                    {
                        "error": "Account doesn't exist. Please create an account first.",
                        "code": "USER_NOT_FOUND",
                    }
                ),
                404,
            )

        if user.auth_provider == "google" and not user.password_hash:
            return (
                jsonify({"error": "Please sign in with Google", "code": "USE_GOOGLE"}),
                400,
            )

        if not user.check_password(data.password):
            return (
                jsonify(
                    {"error": "Please enter a valid password", "code": "WRONG_PASSWORD"}
                ),
                401,
            )

        token = generate_token(user.id, user.email, user.is_admin)

        response = UserResponse.model_validate(user).model_dump()
        response["token"] = token

        return jsonify(response)


@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    data = request.get_json()
    access_token = data.get("access_token")

    if not access_token:
        return jsonify({"error": "Access token required"}), 400

    google_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if google_response.status_code != 200:
        return jsonify({"error": "Invalid Google token"}), 401

    google_user = google_response.json()

    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == google_user["email"])
        ).first()

        if user:
            user.google_id = google_user.get("sub")
            if not user.name:
                user.name = google_user.get("name")
            if not user.picture:
                user.picture = google_user.get("picture")
            if user.auth_provider == "local":
                user.auth_provider = "both"
        else:
            user = User(
                email=google_user["email"],
                google_id=google_user.get("sub"),
                name=google_user.get("name"),
                picture=google_user.get("picture"),
                auth_provider="google",
            )
            session.add(user)

        session.commit()
        session.refresh(user)

        token = generate_token(user.id, user.email, user.is_admin)

        response = UserResponse.model_validate(user).model_dump()
        response["token"] = token

        return jsonify(response)


@app.route("/api/verify-token", methods=["GET"])
@token_required
def verify_token():
    return jsonify({"valid": True, "user": request.current_user})


@app.route("/api/me", methods=["GET"])
@token_required
def get_current_user():
    with Session(engine) as session:
        user = session.get(User, request.current_user["user_id"])
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(UserResponse.model_validate(user).model_dump())


def send_reset_email(to_email, reset_link):
    sender_email = config.get("EMAIL_ADDRESS")
    sender_password = config.get("EMAIL_PASSWORD")

    if not sender_email or not sender_password:
        print("Email not configured. Reset link:", reset_link)
        return

    try:
        message = MIMEMultipart("alternative")
        message["From"] = sender_email.strip()
        message["To"] = to_email.strip()
        message["Subject"] = "Reset Your Password - Pernulo Pearl Jewelry"
        text_body = (
            "Hi,\n\n"
            "We received a request to reset your password for your Pernulo Pearl Jewelry account.\n\n"
            "Click the link below to reset your password:\n"
            f"{reset_link}\n\n"
            "This link will expire in 1 hour for security reasons.\n\n"
            "If you didn't request this password reset, please ignore this email.\n\n"
            "Best regards,\n"
            "Pernulo Pearl Jewelry Team"
        )
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Reset Your Password</h2>
                    <p>Hi,</p>
                    <p>We received a request to reset your password for your Pernulo Pearl Jewelry account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" 
                           style="background-color: #4CAF50; 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 5px; 
                                  display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #4CAF50;">{reset_link}</p>
                    <p style="color: #e74c3c; font-size: 14px;">
                        <strong>This link will expire in 1 hour for security reasons.</strong>
                    </p>
                    <p style="color: #7f8c8d; font-size: 14px;">
                        If you didn't request this password reset, please ignore this email. 
                        Your password will remain unchanged.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #7f8c8d; font-size: 12px;">
                        Best regards,<br>
                        Pernulo Pearl Jewelry Team
                    </p>
                </div>
            </body>
        </html>
        """

        message.attach(MIMEText(text_body, "plain"))
        message.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email.strip(), sender_password.strip())
            server.send_message(message)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")


@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = ForgotPasswordRequest.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()

        if not user:
            return jsonify({"error": "Email not found"}), 404

        if user.auth_provider == "google" and not user.password_hash:
            return (
                jsonify(
                    {
                        "error": "This account uses Google Sign-In. Please login with Google.",
                        "code": "USE_GOOGLE",
                    }
                ),
                400,
            )

        token = user.generate_reset_token()
        session.commit()

        frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
        reset_link = f"{frontend_url}/reset-password?token={token}"
        print(f"Password reset link for {user.email}: {reset_link}")

        send_reset_email(user.email, reset_link)

        return jsonify({"message": "Reset link sent"})


@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    try:
        data = ResetPasswordRequest.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        user = session.exec(select(User).where(User.reset_token == data.token)).first()

        if not user:
            return jsonify({"error": "Invalid or expired reset link"}), 400

        if not user.verify_reset_token(data.token):
            return jsonify({"error": "Invalid or expired reset link"}), 400

        user.set_password(data.password)
        user.clear_reset_token()

        if user.auth_provider == "google":
            user.auth_provider = "both"

        session.commit()

        return jsonify({"message": "Password reset successful"})


@app.route("/api/verify-reset-token", methods=["POST"])
def verify_reset_token():
    data = request.get_json()
    token = data.get("token")

    if not token:
        return jsonify({"valid": False})

    with Session(engine) as session:
        user = session.exec(select(User).where(User.reset_token == token)).first()

        if not user or not user.verify_reset_token(token):
            return jsonify({"valid": False})

        return jsonify({"valid": True, "email": user.email})


# Admin User Management


@app.route("/api/users", methods=["GET"])
@admin_required
def get_all_users():
    """Get all users - ADMIN ONLY"""
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        results = [UserResponse.model_validate(user).model_dump() for user in users]
        return jsonify(results)


@app.route("/api/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    """Delete user account - ADMIN ONLY"""
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        email = user.email
        session.delete(user)
        session.commit()

        return jsonify({"message": f"User {email} deleted successfully"}), 200


if __name__ == "__main__":
    create_db_and_tables()

    port = int(os.environ.get("PORT", 8000))

    cert_file = "localhost+1.pem"
    key_file = "localhost+1-key.pem"

    if os.path.exists(cert_file) and os.path.exists(key_file):
        print(f"Running with HTTPS on https://localhost:{port}")
        app.run(debug=True, port=port, ssl_context=(cert_file, key_file))
    else:
        print(f"Running without HTTPS on http://localhost:{port}")
        app.run(debug=True, port=port)
