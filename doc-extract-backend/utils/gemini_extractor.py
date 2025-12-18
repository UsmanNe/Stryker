import os
import json
import re
from dateutil import parser
from google import genai

# ---------------- Gemini Client ----------------
client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

# ---------------- Fallback for date ----------------
def extract_date_fallback(raw_text):
    """
    Try to find a date in the invoice text using regex and parse it to YYYY-MM-DD
    """
    # Matches 12/18/2025, 18-12-2025, Dec 18, 2025, etc.
    date_patterns = re.findall(
        r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\w{3,9} \d{1,2}, \d{4})\b", raw_text
    )
    if date_patterns:
        try:
            return str(parser.parse(date_patterns[0], dayfirst=False).date())
        except:
            return ""
    return ""

# ---------------- Extract Invoice Data ----------------
def extract_invoice_data(raw_text):
    """
    Extract structured invoice data using Gemini AI, with fallback for missing dates
    """
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
        # Call Gemini API
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        structured_data_text = response.text.strip()

        # Remove possible ```json ... ``` wrappers
        if structured_data_text.startswith("```"):
            structured_data_text = "\n".join(structured_data_text.split("\n")[1:-1]).strip()

        # Safe JSON parse
        try:
            structured_data = json.loads(structured_data_text)
        except json.JSONDecodeError:
            structured_data = {"error": "Failed to parse JSON", "raw_output": structured_data_text}

        # ---------------- Date Fallback ----------------
        if structured_data.get("InvoiceDate") in [None, "", " "]:
            structured_data["InvoiceDate"] = extract_date_fallback(raw_text)

        return structured_data

    except Exception as e:
        return {"error": str(e)}
