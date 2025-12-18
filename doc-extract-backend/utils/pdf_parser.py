from pdf2image import convert_from_path
import pdfplumber
from PIL import Image, ImageOps, ImageFilter
import pytesseract
import re

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image: Image.Image) -> Image.Image:
    gray = ImageOps.grayscale(image)
    gray = ImageOps.autocontrast(gray)
    gray = gray.point(lambda x: 0 if x < 140 else 255, '1')
    gray = gray.filter(ImageFilter.SHARPEN)
    return gray

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        if not text.strip() or len(re.findall(r"[A-Za-z0-9]", text)) < 20:
            images = convert_from_path(file_path)
            for image in images:
                preprocessed = preprocess_image(image)
                text += pytesseract.image_to_string(preprocessed) + "\n"

    except Exception as e:
        print("Error extracting PDF text:", e)
        text = ""
    return text
