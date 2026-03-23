from markitdown import MarkItDown

# Initialize MarkItDown
md = MarkItDown(enable_plugins=False)  # Set True if you want plugins like OCR

# Path to your PDF file
pdf_file = r"Claude Skills Document-Processing Deep Dive_ The Technical Architecture Behind Intelligent PPT Generation .pdf"

# Convert PDF to Markdown
result = md.convert(pdf_file)

# Print the Markdown content
print(result.text_content)