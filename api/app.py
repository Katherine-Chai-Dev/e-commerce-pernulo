

# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# from sqlmodel import SQLModel, create_engine, Session, select
# from dotenv import dotenv_values
# from models import Product, ProductCreate, ProductResponse
# from decimal import Decimal
# from werkzeug.utils import secure_filename
# import os

# app = Flask(__name__)

# CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# config = dotenv_values(".env")
# DATABASE_URL = config.get("DATABASE_URL", "sqlite:///products.db")
# engine = create_engine(DATABASE_URL, echo=True)

# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)

# UPLOAD_BASE = os.path.join(os.path.dirname(__file__), 'uploads')
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'}
# os.makedirs(os.path.join(UPLOAD_BASE, 'products'), exist_ok=True)
# os.makedirs(os.path.join(UPLOAD_BASE, 'profile'), exist_ok=True)

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def save_image(file, folder='products'):
#     if folder not in ['products', 'profile']:
#         raise ValueError("folder must be 'products' or 'profile'")
#     filename = secure_filename(file.filename)
#     import time
#     name, ext = os.path.splitext(filename)
#     filename = f"{name}_{int(time.time())}{ext}"
#     filepath = os.path.join(UPLOAD_BASE, folder, filename)
#     file.save(filepath)
#     return filename

# @app.route('/uploads/<folder>/<filename>')
# def serve_image(folder, filename):
#     if folder not in ['products', 'profile']:
#         return "Invalid folder", 404
#     return send_from_directory(os.path.join(UPLOAD_BASE, folder), filename)


# # Get method
# @app.route("/api/products", methods=["GET"])
# def get_products():
#     with Session(engine) as session:
#         products = session.exec(select(Product)).all()
        
#         results = []
#         for p in products:
#             response = ProductResponse.model_validate(p)
#             data = response.model_dump()
#             results.append(data)
        
#         return jsonify(results)


# @app.route("/api/products/<int:product_id>", methods=["GET"])
# def get_product(product_id):
#     with Session(engine) as session:
#         product = session.get(Product, product_id)
#         if not product:
#             return jsonify({"error": "Product not found"}), 404
#         return jsonify(ProductResponse.model_validate(product).model_dump())

# #Post method
# @app.route("/api/products", methods=["POST"])
# def create_product():
#     try:
#         if request.is_json:
#             data = request.get_json()
#         else:
#             data = request.form.to_dict()

#         product_name = data.get("product_name")
#         quantity_in_stock = data.get("quantity_in_stock")
#         original_price = data.get("original_price")
#         discount = data.get("discount", "0.00")
#         gemstone = data.get("gemstone")
#         materials = data.get("materials")
#         size = data.get("size")
#         description = data.get("description")

#         if not product_name:
#             return jsonify({"error": "product_name is required"}), 400
#         if not quantity_in_stock:
#             return jsonify({"error": "quantity_in_stock is required"}), 400
#         if not original_price:
#             return jsonify({"error": "original_price is required"}), 400

#         quantity_in_stock = int(quantity_in_stock)
#         original_price = Decimal(original_price)
#         discount = Decimal(discount)
        
#         image_paths = []
#         if 'images' in request.files:
#             files = request.files.getlist('images')
#             for file in files:
#                 if file.filename != '' and allowed_file(file.filename):
#                     image_paths.append(save_image(file))

#         if request.is_json and data.get('image_paths'):
#             image_paths.extend(data['image_paths'])

#         with Session(engine) as session:
#             product = Product(
#                 product_name=product_name,
#                 quantity_in_stock=quantity_in_stock,
#                 original_price=original_price,
#                 discount=discount,
#                 image_paths=image_paths,
#                 gemstone=gemstone,
#                 materials=materials,
#                 size=size,
#                 description=description
#             )

#             product.calculate_discounted_price()

#             session.add(product)
#             session.commit()
#             session.refresh(product)

#             return jsonify(ProductResponse.model_validate(product).model_dump()), 201

#     except ValueError as e:
#         print("ERROR:", str(e))
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": f"Invalid input: {str(e)}"}), 400
    
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500


# @app.route('/api/products/<int:product_id>', methods=['PUT'])
# def update_product(product_id):
#     try:
#         with Session(engine) as session:
#             product = session.get(Product, product_id)
#             if not product:
#                 return jsonify({"error": "Product not found"}), 404

#             if request.is_json:
#                 data = request.get_json()
#             else:
#                 data = request.form.to_dict()

#             if data.get('product_name'):
#                 product.product_name = data['product_name']
#             if data.get('quantity_in_stock') not in [None, '']:
#                 product.quantity_in_stock = int(data['quantity_in_stock'])
#             if data.get('original_price'):
#                 product.original_price = Decimal(str(data['original_price']))
#             if data.get('discount') is not None:
#                 product.discount = Decimal(str(data['discount']))
#             if data.get('image_paths'):
#                 product.image_paths = data['image_paths']
#             if data.get('gemstone') is not None:
#                 product.gemstone = data['gemstone']
#             if data.get('materials') is not None:
#                 product.materials = data['materials']
#             if data.get('size') is not None:
#                 product.size = data['size']
#             if data.get('description') is not None:
#                 product.description = data['description']

#             # Handle file uploads
#             if 'images' in request.files:
#                 files = request.files.getlist('images')
#                 new_paths = list(product.image_paths or [])
#                 for file in files:
#                     if file.filename != '' and allowed_file(file.filename):
#                         new_paths.append(save_image(file))
#                 product.image_paths = new_paths

#             product.calculate_discounted_price()

#             session.add(product)
#             session.commit()
#             session.refresh(product)

#             return jsonify(ProductResponse.model_validate(product).model_dump()), 200

#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500


# @app.route('/api/products/<int:product_id>', methods=['DELETE'])
# def delete_product(product_id):
#     try:
#         with Session(engine) as session:
#             product = session.get(Product, product_id)
#             if not product:
#                 return jsonify({"error": "Product not found"}), 404

#             session.delete(product)
#             session.commit()

#             return jsonify({"message": "Product deleted successfully"}), 200

#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500


# if __name__ == "__main__":
#     create_db_and_tables()
#     app.run(debug=True, port=8000)


from flask import Flask, request, jsonify, send_from_directory
import os
import requests
from flask_cors import CORS
from sqlmodel import SQLModel, create_engine, Session, select
from dotenv import dotenv_values
from productModel import Product, ProductCreate, ProductResponse
from userModel import User, UserCreate, UserLogin, UserResponse, ForgotPasswordRequest, ResetPasswordRequest
from decimal import Decimal
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

config = dotenv_values(".env")
DATABASE_URL = config.get("DATABASE_URL", "sqlite:///products.db")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
# Upload images
UPLOAD_BASE = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'}
os.makedirs(os.path.join(UPLOAD_BASE, 'products'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_BASE, 'profile'), exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file, folder='products'):
    if folder not in ['products', 'profile']:
        raise ValueError("folder must be 'products' or 'profile'")
    filename = secure_filename(file.filename)
    import time
    name, ext = os.path.splitext(filename)
    filename = f"{name}_{int(time.time())}{ext}"
    filepath = os.path.join(UPLOAD_BASE, folder, filename)
    file.save(filepath)
    return filename

@app.route('/uploads/<folder>/<filename>')
def serve_image(folder, filename):
    if folder not in ['products', 'profile']:
        return "Invalid folder", 404
    return send_from_directory(os.path.join(UPLOAD_BASE, folder), filename)


# Product Routes
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
        if 'images' in request.files:
            files = request.files.getlist('images')
            for file in files:
                if file.filename != '' and allowed_file(file.filename):
                    image_paths.append(save_image(file))

        if request.is_json and data.get('image_paths'):
            image_paths.extend(data['image_paths'])

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
                description=description
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


@app.route('/api/products/<int:product_id>', methods=['PUT'])
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

            if data.get('product_name'):
                product.product_name = data['product_name']
            if data.get('quantity_in_stock') not in [None, '']:
                product.quantity_in_stock = int(data['quantity_in_stock'])
            if data.get('original_price'):
                product.original_price = Decimal(str(data['original_price']))
            if data.get('discount') is not None:
                product.discount = Decimal(str(data['discount']))
            if data.get('image_paths'):
                product.image_paths = data['image_paths']
            if data.get('gemstone') is not None:
                product.gemstone = data['gemstone']
            if data.get('materials') is not None:
                product.materials = data['materials']
            if data.get('size') is not None:
                product.size = data['size']
            if data.get('description') is not None:
                product.description = data['description']

            if 'images' in request.files:
                files = request.files.getlist('images')
                new_paths = list(product.image_paths or [])
                for file in files:
                    if file.filename != '' and allowed_file(file.filename):
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


@app.route('/api/products/<int:product_id>', methods=['DELETE'])
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

@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = UserCreate.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == data.email)).first()
        if existing:
            # Check if registered with Google
            if existing.auth_provider == "google":
                return jsonify({
                    "error": "This email is already registered with Google.",
                    "code": "EMAIL_EXISTS_GOOGLE"
                }), 400
            else:
                return jsonify({
                    "error": "This email is already registered.",
                    "code": "EMAIL_EXISTS"
                }), 400

        user = User(email=data.email, name=data.name, auth_provider="local")
        user.set_password(data.password)
        session.add(user)
        session.commit()
        session.refresh(user)

        return jsonify(UserResponse.model_validate(user).model_dump()), 201

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = UserLogin.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        
        if not user:
            return jsonify({
                "error": "Account doesn't exist. Please create an account first.",
                "code": "USER_NOT_FOUND"
            }), 404  

        if user.auth_provider == "google" and not user.password_hash:
            return jsonify({
                "error": "Please sign in with Google",
                "code": "USE_GOOGLE"
            }), 400

        if not user.check_password(data.password):
            return jsonify({
                "error": "Please enter a valid password",
                "code": "WRONG_PASSWORD"
            }), 401

        return jsonify(UserResponse.model_validate(user).model_dump())


@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    data = request.get_json()
    access_token = data.get("access_token")

    if not access_token:
        return jsonify({"error": "Access token required"}), 400

    google_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if google_response.status_code != 200:
        return jsonify({"error": "Invalid Google token"}), 401

    google_user = google_response.json()

    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == google_user["email"])
        ).first()


        if user:
            # User exists - only update if not already set
            user.google_id = google_user.get("sub")
            if not user.name:  # Only update if name is empty
                user.name = google_user.get("name")
            if not user.picture:  # Only update if picture is empty
                user.picture = google_user.get("picture")
            if user.auth_provider == "local":
                user.auth_provider = "both"
        else:
            # New user - use Google's info
            user = User(
                email=google_user["email"],
                google_id=google_user.get("sub"),
                name=google_user.get("name"),
                picture=google_user.get("picture"),
                auth_provider="google"
            )
            session.add(user)

        session.commit()
        session.refresh(user)

        return jsonify(UserResponse.model_validate(user).model_dump())


# Reset password
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
        
        # Plain text version
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
        
        # HTML version (looks much better in email clients)
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
        
        # Attach both versions (email clients will choose the best one)
        message.attach(MIMEText(text_body, "plain"))
        message.attach(MIMEText(html_body, "html"))
        
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email.strip(), sender_password.strip())
            server.send_message(message)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")


# Forgot Password - Request reset link
@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = ForgotPasswordRequest.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()

        # Always return success (don't reveal if email exists)
        if not user:
            return jsonify({"message": "If an account exists, a reset link has been sent."})

        # Check if user registered with Google only
        if user.auth_provider == "google" and not user.password_hash:
            return jsonify({"message": "If an account exists, a reset link has been sent."})

        # Generate reset token
        token = user.generate_reset_token()
        session.commit()

        # Create reset link
        reset_link = f"http://localhost:3000/reset-password?token={token}"

        # For now, just print the link (replace with email later)
        print(f"Password reset link for {user.email}: {reset_link}")
        
        send_reset_email(user.email, reset_link)


        return jsonify({"message": "If an account exists, a reset link has been sent."})



    
# Reset Password - Use token to set new password
@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    try:
        data = ResetPasswordRequest.model_validate(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.reset_token == data.token)
        ).first()

        if not user:
            return jsonify({"error": "Invalid or expired reset link"}), 400

        if not user.verify_reset_token(data.token):
            return jsonify({"error": "Invalid or expired reset link"}), 400

        # Set new password
        user.set_password(data.password)
        user.clear_reset_token()
        
        # If user was Google-only, now they have both methods
        if user.auth_provider == "google":
            user.auth_provider = "both"

        session.commit()

        return jsonify({"message": "Password reset successful"})


# Verify token is valid (for frontend to check before showing form)
@app.route("/api/verify-reset-token", methods=["POST"])
def verify_reset_token():
    data = request.get_json()
    token = data.get("token")

    if not token:
        return jsonify({"valid": False})

    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.reset_token == token)
        ).first()

        if not user or not user.verify_reset_token(token):
            return jsonify({"valid": False})

        return jsonify({"valid": True, "email": user.email})

# test    
@app.route("/api/users", methods=["GET"])
def get_all_users():
    """Get all users - FOR TESTING ONLY"""
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        results = [UserResponse.model_validate(user).model_dump() for user in users]
        return jsonify(results)
    
@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    """Delete user account - FOR TESTING ONLY"""
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
    app.run(debug=True, port=8000)