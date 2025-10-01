# vCard QR Code Generator

A simple web application that generates vCard QR codes from CSV data. Scan the QR codes with any smartphone to instantly save contact information.

## Features

- 📁 **CSV File Upload**: Upload CSV files with contact data
- 📱 **vCard QR Codes**: Generates standard vCard 3.0 format QR codes
- 👁️ **Data Preview**: View your CSV data in a table before generation
- 🔄 **Batch Generation**: Generate all QR codes with one click
- 💾 **Individual Downloads**: Download each QR code as a PNG file
- 📦 **Bulk Download**: Download all QR codes as a ZIP file
- 🎯 **Clean & Simple**: No design clutter, just QR codes

## How to Use

### 1. Prepare Your CSV File

Create a CSV file with the following columns:

| Column       | Description                    | Required |
|--------------|--------------------------------|----------|
| name         | Full name of the person        | Yes      |
| title        | Job title or position          | Optional |
| email        | Email address                  | Optional |
| phone        | Phone number                   | Optional |
| organization | Company/Organization name      | Optional |
| website      | Website URL                    | Optional |
| address      | Physical address               | Optional |

**Example CSV format:**
```csv
name,title,email,phone,organization,website,address
"John Smith","Senior Software Engineer","john.smith@njdegypt.com","(555) 123-4567","New Jersey Developments","njdegypt.com","Concord Plaza 90th Street"
"Sarah Johnson","Marketing Director","sarah.johnson@njdegypt.com","(555) 987-6543","New Jersey Developments","njdegypt.com","Concord Plaza 90th Street"
```

### 2. Run the Application

1. Open `index.html` in your web browser
2. Click "Choose CSV File" and select your CSV file
3. Review your data in the table
4. Click "Generate QR Codes" to create vCard QR codes
5. Download individual QR codes or download all as a ZIP file

### 3. Scan QR Codes

- Use any smartphone camera or QR code scanner app
- Point at the QR code
- Contact information will be automatically imported to your phone's contacts

## File Structure

```
Project Z/
├── index.html          # Main application page
├── styles.css          # Professional styling
├── script.js           # Application functionality
├── sample-data.csv     # Example CSV file
└── README.md           # This file
```

## vCard Format

The generated QR codes contain vCard 3.0 formatted data with the following fields:
- Full Name (FN)
- Organization (ORG)
- Title (TITLE)
- Work Phone (TEL;TYPE=WORK,VOICE)
- Work Email (EMAIL;TYPE=WORK)
- Work Address (ADR;TYPE=WORK)
- Website URL (URL)

## Technical Details

- **QR Code Library**: davidshimjs-qrcodejs
- **Error Correction**: Level H (High - 30% recovery)
- **Output Format**: PNG images (400x400 pixels)
- **ZIP Library**: JSZip for batch downloads
- **Browser Support**: Modern browsers with ES6 support

## Sample Data

A `sample-data.csv` file is included for testing purposes. You can use this to see how the application works before creating your own CSV file.

## Troubleshooting

- **File not uploading**: Make sure your file has a `.csv` extension
- **Missing data**: Check that your CSV has the correct column headers (at minimum: name)
- **QR code not scanning**: Ensure good lighting and hold phone steady
- **Download not working**: Check that your browser allows downloads

## Browser Compatibility

This application works best in modern browsers:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

---

**Ready to generate vCard QR codes?** Just open `index.html` and get started!
