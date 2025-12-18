# AI-Powered Invoice Extraction Suite

An intelligent end-to-end solution for automating data entry from invoices. This application leverages **Optical Character Recognition (OCR)** and **Generative AI (LLMs)** to transform unstructured documents (PDFs and images) into structured, actionable data stored in a relational database.

## 🏗 Project Architecture

The project is built using a decoupled client-server architecture:

````text
├── doc-extract-backend
│   ├── database/       # SQLite DB and SQLAlchemy engine
│   ├── models/         # Database schemas & ORM definitions
│   ├── uploads/        # Local storage for processed files
│   └── utils/          # OCR engines & AI prompt logic
└── frontend
    ├── api/            # API service layer (Axios)
    ├── components/     # UI Library
    │   ├── common/     # Reusable UI elements
    │   ├── Invoice/    # Extraction specific logic
    │   └── Layout/     # Navigation & wrappers
    ├── pages/          # Next.js file-based routing
    ├── styles/         # Global & modular CSS
    └── utils/          # Formatting & validation helpers


    Here is the complete, formatted README.md content. You can copy the block below and paste it directly into your file.

Markdown

# AI-Powered Invoice Extraction Suite

An intelligent end-to-end solution for automating data entry from invoices. This application leverages **Optical Character Recognition (OCR)** and **Generative AI (LLMs)** to transform unstructured documents (PDFs and images) into structured, actionable data stored in a relational database.



## 🏗 Project Architecture

The project is built using a decoupled client-server architecture:

```text
├── doc-extract-backend
│   ├── database/       # SQLite DB and SQLAlchemy engine
│   ├── models/         # Database schemas & ORM definitions
│   ├── uploads/        # Local storage for processed files
│   └── utils/          # OCR engines & AI prompt logic
└── frontend
    ├── api/            # API service layer (Axios)
    ├── components/     # UI Library
    │   ├── common/     # Reusable UI elements
    │   ├── Invoice/    # Extraction specific logic
    │   └── Layout/     # Navigation & wrappers
    ├── pages/          # Next.js file-based routing
    ├── styles/         # Global & modular CSS
    └── utils/          # Formatting & validation helpers
🚀 Key Features
Hybrid Extraction: Combines pdfplumber for digital PDFs and Tesseract OCR for scanned images.

AI-Driven Parsing: Utilizes Google Gemini or OpenAI to intelligently identify line items, tax, and vendor details.

Persistent Storage: Full CRUD operations managed via Flask and SQLAlchemy.

Real-time Review: Editable frontend tables to verify and correct AI-extracted data.

Multi-Format Support: Handles PDF, PNG, JPG, and JPEG formats.
Component,Technologies
Frontend,"Next.js (React), Axios, Modular CSS"
Backend,"Python 3.11+, Flask, Flask-CORS"
Database,"SQLite, SQLAlchemy"
AI/OCR,"Google Gemini / OpenAI, Pytesseract, pdfplumber"
Processing,"Pillow (PIL), Pandas, python-dateutil"


Installation & Setup


cd doc-extract-backend

# Initialize environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file and add:
# GENAI_API_KEY=your_api_key_here

# Run the server
python app.py


cd ../frontend

# Install packages
npm install

# Start development server
npm run dev



Endpoint,Method,Description,Request Body
/,GET,Health check / API status.,N/A
/upload,POST,Uploads file to server.,file (form-data)
/extract,POST,Processes file via AI/OCR.,"{ ""file_path"": ""..."" }"
/invoices,GET,Retrieves all saved records.,N/A
/update_invoice/<id>,PUT,Updates existing record fields.,"{ ""structured_data"": {...} }"
````
