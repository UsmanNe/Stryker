from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.invoice import Base, Invoice
from utils.pdf_parser import extract_text_from_pdf
from utils.image_parser import extract_text_from_image
import os
import json
import pytesseract
import re
from dateutil import parser
from google import genai

# ---------------------------- Gemini Client ----------------------------
client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

# ---------------------------- Config ----------------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DB_PATH = "sqlite:///database/invoices.db"
engine = create_engine(DB_PATH)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine, expire_on_commit=False)

# Explicit Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ---------------------------- Helpers ----------------------------
def extract_date_fallback(raw_text):
    """Fallback to find a date in messy OCR text"""
    patterns = re.findall(r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w{3,9} \d{1,2}, \d{4})\b", raw_text)
    if patterns:
        try:
            return str(parser.parse(patterns[0], dayfirst=False).date())
        except:
            return ""
    return ""

def extract_invoice_data(raw_text):
    """Call Gemini AI and fallback for missing date"""
    prompt = f"""
You are an AI that extracts structured data from invoices.
Return the result strictly as JSON in this format:

{{
  "InvoiceNumber": "",
  "InvoiceDate": "YYYY-MM-DD",
  "CustomerName": "",
  "TotalAmount": "",
  "LineItems": [
    {{"Product": "", "Quantity": "", "Price": ""}}
  ]
}}

Invoice text:
{raw_text}

Rules:
1. Return InvoiceDate strictly in ISO format YYYY-MM-DD.
2. If a value is missing, return an empty string.
3. Do NOT return extra text, comments, or Markdown.
"""
    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        structured_text = response.text.strip()

        # Remove ``` wrapper if present
        if structured_text.startswith("```"):
            structured_text = "\n".join(structured_text.split("\n")[1:-1]).strip()

        # Safe JSON parse
        try:
            data = json.loads(structured_text)
        except json.JSONDecodeError:
            data = {"error": "Failed to parse JSON", "raw_output": structured_text}

        # Fallback for missing date
        if not data.get("InvoiceDate"):
            data["InvoiceDate"] = extract_date_fallback(raw_text)

        return data
    except Exception as e:
        return {"error": str(e)}

# ---------------------------- Routes ----------------------------
@app.route("/")
def hello():
    return "Invoice Extraction API is running!"

@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    return jsonify({"message": "File uploaded successfully", "file_path": file_path})

@app.route("/extract", methods=["POST"])
def extract():
    data = request.get_json()
    file_path = data.get("file_path")

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 400

    ext = file_path.lower()
    if ext.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_path)
    elif ext.endswith((".png", ".jpg", ".jpeg")):
        raw_text = extract_text_from_image(file_path)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    structured_data = extract_invoice_data(raw_text)

    # Save to DB
    session = Session()
    invoice = Invoice(
        file_name=os.path.basename(file_path),
        raw_text=raw_text,
        structured_data=json.dumps(structured_data)
    )
    session.add(invoice)
    session.commit()

    invoice_data = {
        "file_name": invoice.file_name,
        "raw_text": invoice.raw_text,
        "structured_data": structured_data
    }
    session.close()

    return jsonify(invoice_data)

@app.route("/invoices", methods=["GET"])
def get_invoices():
    session = Session()
    invoices = session.query(Invoice).all()
    result = []
    for inv in invoices:
        try:
            data = json.loads(inv.structured_data)
        except:
            data = inv.structured_data
        result.append({
            "id": inv.id,
            "file_name": inv.file_name,
            "raw_text": inv.raw_text,
            "structured_data": data
        })
    session.close()
    return jsonify(result)

@app.route("/update_invoice/<int:invoice_id>", methods=["PUT"])
def update_invoice(invoice_id):
    data = request.get_json()
    session = Session()
    invoice = session.query(Invoice).filter_by(id=invoice_id).first()

    if not invoice:
        session.close()
        return jsonify({"error": "Invoice not found"}), 404

    if "structured_data" in data:
        structured_data = data["structured_data"]

        # Recalculate total
        total = 0.0
        for item in structured_data.get("LineItems", []):
            try:
                price = float(str(item.get("Price", "0")).replace(",", "").replace("$", "").strip())
                quantity = float(str(item.get("Quantity", "0")).replace(",", "").strip())
                total += price * quantity
            except Exception:
                continue  # skip invalid values

        structured_data["TotalAmount"] = round(total, 2)

        invoice.structured_data = json.dumps(structured_data)

    if "raw_text" in data:
        invoice.raw_text = data["raw_text"]

    session.commit()
    session.close()
    return jsonify({"message": "Invoice updated successfully"})



# ---------------------------- Run server ----------------------------
if __name__ == "__main__":
    app.run(debug=True)
