from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True)
    file_name = Column(String, nullable=False)
    raw_text = Column(Text)
    structured_data = Column(Text)
