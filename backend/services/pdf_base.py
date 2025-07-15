from fpdf import FPDF
from datetime import datetime
from config import Config
import os

class BasePDFReport(FPDF):
    def __init__(self, title="SmartStock AI Report"):
        super().__init__()
        self.title = title
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font('Arial', 'B', 16)
        self.set_text_color(0, 0, 0)
        self.cell(0, 10, self.title, ln=True, align='C')
        self.set_font('Arial', 'I', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, f'Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', ln=True, align='C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 14)
        self.set_text_color(0, 0, 0)
        self.cell(0, 10, title, ln=True)
        self.ln(5)

class BasePDFGenerator:
    def __init__(self, report_title, pdf_class):
        self.report_title = report_title
        self.pdf_class = pdf_class

    def generate_pdf(self, seller_id, sections_callback):
        """
        sections_callback(pdf) should add all report sections to the pdf.
        Returns the path to the generated PDF.
        """
        Config.create_directories()
        pdf = self.pdf_class(title=self.report_title)
        pdf.alias_nb_pages()
        pdf.add_page()
        sections_callback(pdf)
        filename = f"{self.report_title.lower().replace(' ', '_')}_{seller_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = Config.REPORTS_DIR / filename
        pdf.output(str(pdf_path))
        return pdf_path 