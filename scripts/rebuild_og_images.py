import os
from PIL import Image, ImageDraw, ImageFont

PUBLIC_DIR = r"g:\ixdocs-doc-wizard\public"
OFFICIAL_LOGO_PATH = os.path.join(PUBLIC_DIR, "ixdocs-logo.png")

FONT_REGULAR_PATH = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BOLD_PATH = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_SEMIBOLD_PATH = r"C:\Windows\Fonts\segoeuib.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_dot_grid(draw, width, height, step=32, dot_color=(226, 232, 240, 140)):
    for x in range(step // 2, width, step):
        for y in range(step // 2, height, step):
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=dot_color)

def build_calculator_og(
    filename,
    title,
    subtitle,
    description,
    category_label,
    pills
):
    w, h = 1200, 630
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Subtle soft mint-cyan background gradient
    for y in range(h):
        r = int(250 + (255 - 250) * (y / h))
        g = int(254 + (255 - 254) * (y / h))
        b = int(252 + (255 - 252) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Dot pattern
    draw_dot_grid(draw, w, h, step=34, dot_color=(209, 230, 222, 120))

    # Top brand bar
    draw.rectangle([0, 0, w, 4], fill=(5, 150, 105, 255)) # emerald-600

    # Official Logo in top-left
    if os.path.exists(OFFICIAL_LOGO_PATH):
        logo = Image.open(OFFICIAL_LOGO_PATH).convert("RGBA")
        logo_size = 56
        logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        img.paste(logo_resized, (64, 52), logo_resized)

    # Header Wordmark: IXDocs™ Calculator
    f_brand_bold = get_font(FONT_BOLD_PATH, 28)
    f_brand_reg = get_font(FONT_REGULAR_PATH, 28)
    draw.text((132, 60), "IXDocs", font=f_brand_bold, fill=(15, 23, 42, 255)) # navy
    # Add ™
    f_tm = get_font(FONT_BOLD_PATH, 14)
    draw.text((236, 56), "™", font=f_tm, fill=(5, 150, 105, 255))
    draw.text((258, 60), "Calculator", font=f_brand_bold, fill=(5, 150, 105, 255))

    # Top-right category pill
    f_cat = get_font(FONT_BOLD_PATH, 13)
    cat_text = category_label.upper()
    cat_bbox = f_cat.getbbox(cat_text)
    cat_w = cat_bbox[2] - cat_bbox[0]
    cat_box_w = cat_w + 28
    cat_box_x = w - 64 - cat_box_w
    draw.rounded_rectangle([cat_box_x, 58, cat_box_x + cat_box_w, 92], radius=10, fill=(241, 245, 249, 255), outline=(226, 232, 240, 255))
    draw.text((cat_box_x + 14, 66), cat_text, font=f_cat, fill=(71, 85, 105, 255))

    # Main Title
    f_title = get_font(FONT_BOLD_PATH, 56)
    draw.text((64, 180), title, font=f_title, fill=(15, 23, 42, 255))

    # Subtitle (emerald)
    f_sub = get_font(FONT_BOLD_PATH, 25)
    draw.text((64, 256), subtitle, font=f_sub, fill=(5, 150, 105, 255))

    # Description (slate)
    f_desc = get_font(FONT_REGULAR_PATH, 20)
    # Wrap description if long
    words = description.split(" ")
    lines = []
    cur = ""
    for word in words:
        test = (cur + " " + word).strip()
        bbox = f_desc.getbbox(test)
        if bbox[2] - bbox[0] > 1050:
            lines.append(cur)
            cur = word
        else:
            cur = test
    if cur:
        lines.append(cur)

    y_desc = 312
    for line in lines[:2]:
        draw.text((64, y_desc), line, font=f_desc, fill=(71, 85, 105, 255))
        y_desc += 32

    # Feature pills
    f_pill = get_font(FONT_BOLD_PATH, 14)
    x_pill = 64
    y_pill = 405
    for pill in pills:
        p_bbox = f_pill.getbbox(pill)
        pw = p_bbox[2] - p_bbox[0]
        box_w = pw + 36
        draw.rounded_rectangle([x_pill, y_pill, x_pill + box_w, y_pill + 38], radius=19, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
        # Green dot
        draw.ellipse([x_pill + 14, y_pill + 15, x_pill + 22, y_pill + 23], fill=(5, 150, 105, 255))
        draw.text((x_pill + 28, y_pill + 9), pill, font=f_pill, fill=(6, 95, 70, 255))
        x_pill += box_w + 14

    # Bottom border line
    draw.line([(64, 530), (w - 64, 530)], fill=(226, 232, 240, 255), width=1)

    # Footer
    f_foot = get_font(FONT_REGULAR_PATH, 16)
    f_foot_bold = get_font(FONT_BOLD_PATH, 16)
    draw.text((64, 555), "Part of the IXDocs Platform · 100% Free & Private", font=f_foot, fill=(100, 116, 139, 255))
    draw.text((w - 230, 555), "calc.ixdocs.com →", font=f_foot_bold, fill=(5, 150, 105, 255))

    out_path = os.path.join(PUBLIC_DIR, filename)
    img.save(out_path, "PNG", optimize=True)
    print(f"Generated: {filename} (1200x630)")

# Main PDF-Tool OG standardizer
def standardize_pdf_tool_og(filename, title_override=None, subtitle_override=None):
    w, h = 1200, 630
    src_path = os.path.join(PUBLIC_DIR, filename)
    
    if os.path.exists(src_path) and filename != "og-edit-pdf.png":
        try:
            orig = Image.open(src_path).convert("RGBA")
            orig_w, orig_h = orig.size
            
            # Create fresh 1200x630 canvas
            canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))
            
            # Scale proportionally to fit or fill cleanly
            scale = min(w / orig_w, h / orig_h)
            new_w = int(orig_w * scale)
            new_h = int(orig_h * scale)
            resized = orig.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            pos_x = (w - new_w) // 2
            pos_y = (h - new_h) // 2
            canvas.paste(resized, (pos_x, pos_y), resized)
            
            # Overlay the official crisp logo in top-left to replace any low-res or approximate logo
            if os.path.exists(OFFICIAL_LOGO_PATH):
                logo = Image.open(OFFICIAL_LOGO_PATH).convert("RGBA")
                # Look at position in 1024x535 images: around x=48, y=48 (scaled)
                logo_x = int(pos_x + 46 * scale)
                logo_y = int(pos_y + 44 * scale)
                logo_size = int(62 * scale)
                logo_badge = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
                canvas.paste(logo_badge, (logo_x, logo_y), logo_badge)

            canvas.save(src_path, "PNG", optimize=True)
            print(f"Standardized: {filename} (1200x630)")
            return
        except Exception as e:
            print(f"Error standardizing {filename}: {e}")

    # For og-edit-pdf.png or if reconstruction needed:
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Soft modern gradient
    for y in range(h):
        r = int(250 + (255 - 250) * (y / h))
        g = int(254 + (255 - 254) * (y / h))
        b = int(252 + (255 - 252) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    draw_dot_grid(draw, w, h, step=34, dot_color=(209, 230, 222, 120))
    draw.rectangle([0, 0, w, 4], fill=(5, 150, 105, 255))
    
    if os.path.exists(OFFICIAL_LOGO_PATH):
        logo = Image.open(OFFICIAL_LOGO_PATH).convert("RGBA")
        logo_resized = logo.resize((64, 64), Image.Resampling.LANCZOS)
        canvas.paste(logo_resized, (64, 52), logo_resized)
        
    f_brand_bold = get_font(FONT_BOLD_PATH, 32)
    draw.text((144, 62), "IXDocs", font=f_brand_bold, fill=(15, 23, 42, 255))
    f_tm = get_font(FONT_BOLD_PATH, 16)
    draw.text((264, 58), "™", font=f_tm, fill=(5, 150, 105, 255))
    
    # Badge
    f_cat = get_font(FONT_BOLD_PATH, 13)
    draw.rounded_rectangle([w - 220, 58, w - 64, 92], radius=10, fill=(241, 245, 249, 255), outline=(226, 232, 240, 255))
    draw.text((w - 200, 66), "PDF UTILITY TOOL", font=f_cat, fill=(71, 85, 105, 255))
    
    # Title
    f_title = get_font(FONT_BOLD_PATH, 58)
    draw.text((64, 180), "Edit PDF", font=f_title, fill=(15, 23, 42, 255))
    
    # Subtitle
    f_sub = get_font(FONT_BOLD_PATH, 26)
    draw.text((64, 258), "Add Text, Remove Content & Annotate PDFs in Browser", font=f_sub, fill=(5, 150, 105, 255))
    
    # Description
    f_desc = get_font(FONT_REGULAR_PATH, 20)
    draw.text((64, 314), "Modify PDF documents directly in your web browser with complete client-side privacy.", font=f_desc, fill=(71, 85, 105, 255))
    draw.text((64, 346), "Zero file uploads. Free, instant, and private document editing.", font=f_desc, fill=(71, 85, 105, 255))
    
    # Pills
    pills = ["100% Client-Side", "Add Text & Images", "Highlight & Whiteout", "No Registration"]
    f_pill = get_font(FONT_BOLD_PATH, 14)
    x_pill = 64
    y_pill = 410
    for pill in pills:
        p_bbox = f_pill.getbbox(pill)
        pw = p_bbox[2] - p_bbox[0]
        box_w = pw + 36
        draw.rounded_rectangle([x_pill, y_pill, x_pill + box_w, y_pill + 38], radius=19, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255))
        draw.ellipse([x_pill + 14, y_pill + 15, x_pill + 22, y_pill + 23], fill=(5, 150, 105, 255))
        draw.text((x_pill + 28, y_pill + 9), pill, font=f_pill, fill=(6, 95, 70, 255))
        x_pill += box_w + 14
        
    draw.line([(64, 530), (w - 64, 530)], fill=(226, 232, 240, 255), width=1)
    f_foot = get_font(FONT_REGULAR_PATH, 16)
    f_foot_bold = get_font(FONT_BOLD_PATH, 16)
    draw.text((64, 555), "Part of the IXDocs Platform · 100% Free & Private", font=f_foot, fill=(100, 116, 139, 255))
    draw.text((w - 200, 555), "ixdocs.com →", font=f_foot_bold, fill=(5, 150, 105, 255))
    
    canvas.save(src_path, "PNG", optimize=True)
    print(f"Reconstructed: {filename} (1200x630)")

if __name__ == "__main__":
    # 1. Calculator Platform
    build_calculator_og(
        "og-calculator.png",
        "IXDocs Calculator",
        "32 Free Online Calculators, Converters & Productivity Tools",
        "Lightning-fast mathematical, financial, health, and developer calculators. 100% in-browser, completely private, with instant PDF reports.",
        "Calculator Platform",
        ["32 Free Tools", "100% Private & In-Browser", "Instant PDF Reports", "No Registration"]
    )
    build_calculator_og(
        "og-basic-calculator.png",
        "Basic Calculator",
        "Clean, Fast Arithmetic with Session History & Keyboard Support",
        "Perform quick addition, subtraction, multiplication, and division with memory recall and exportable calculation logs.",
        "Everyday Math",
        ["Keyboard Navigation", "Full History Log", "Memory Registers", "In-Browser Privacy"]
    )
    build_calculator_og(
        "og-percentage-calculator.png",
        "Percentage Calculator",
        "Solve Any Percentage Problem: Increase, Decrease & Change",
        "Compute percentage change, fraction of a total, and markup/discount values in real time with precision formatting.",
        "Everyday Math",
        ["Percentage Change", "Discount & Markup", "Fraction of Whole", "Instant Computation"]
    )
    build_calculator_og(
        "og-interest-calculator.png",
        "Interest Calculator",
        "Simple & Compound Interest Growth with Schedule Breakdown",
        "Calculate returns, annualized APY, and compounding effects across flexible compounding frequencies.",
        "Finance & Billing",
        ["Simple & Compound", "Custom Frequency", "Growth Breakdown", "PDF Export"]
    )
    build_calculator_og(
        "og-bill-calculator.png",
        "Bill Calculator",
        "POS Retail Invoicing, Barcode Scanner & PDF Receipts",
        "Build itemized retail bills with live camera barcode scanning, automatic item increments, GST calculation, and instant A4/thermal PDF downloads.",
        "Finance & Billing",
        ["Camera Barcode Scanner", "GST Tax Slabs", "Thermal & A4 PDF", "100% In-Browser"]
    )
    build_calculator_og(
        "og-barcode-generator.png",
        "Barcode Generator",
        "Create Standard Product Barcodes with SVG & PNG Export",
        "Generate retail, inventory, and packaging barcodes: Code 128, EAN-13, UPC-A, and Code 39 with printable label views.",
        "QR & Barcode",
        ["Code 128 & EAN-13", "Vector SVG Export", "High-Res PNG", "Printable Labels"]
    )

    # 2. Main PDF Platform
    standardize_pdf_tool_og("og-compress-pdf.png")
    standardize_pdf_tool_og("og-edit-pdf.png")
    standardize_pdf_tool_og("og-merge-pdf.png")
    standardize_pdf_tool_og("og-split-pdf.png")
    standardize_pdf_tool_og("og-jpg-to-pdf.png")
    standardize_pdf_tool_og("ixdocs-og-image.png")
