

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlmodel import SQLModel, create_engine, Session, select
from dotenv import dotenv_values
from models import Product, ProductCreate, ProductResponse
from decimal import Decimal
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

config = dotenv_values(".env")
DATABASE_URL = config.get("DATABASE_URL", "sqlite:///products.db")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Image upload handling
# UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads', 'products')
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'}
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def save_image(file):
#     filename = secure_filename(file.filename)
#     import time
#     name, ext = os.path.splitext(filename)
#     filename = f"{name}_{int(time.time())}{ext}"
#     filepath = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(filepath)
#     return filename



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


# Get method
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

#Post method
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

            # Handle file uploads
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


if __name__ == "__main__":
    create_db_and_tables()
    app.run(debug=True, port=8000)