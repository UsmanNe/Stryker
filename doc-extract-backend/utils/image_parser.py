from PIL import Image, ImageOps, ImageFilter
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image: Image.Image) -> Image.Image:
    gray = ImageOps.grayscale(image)
    gray = ImageOps.autocontrast(gray)
    gray = gray.point(lambda x: 0 if x < 140 else 255, '1')
    gray = gray.filter(ImageFilter.SHARPEN)
    return gray

def extract_text_from_image(file_path: str) -> str:
    try:
        image = Image.open(file_path)
        preprocessed = preprocess_image(image)
        text = pytesseract.image_to_string(preprocessed)
        return text
    except Exception as e:
        print("Error extracting image text:", e)
        return ""
