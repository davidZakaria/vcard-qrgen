class VCardQRGenerator {
    constructor() {
        this.csvData = [];
        this.generatedQRCodes = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('csvFile').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('generateAllBtn').addEventListener('click', () => this.generateAllQRCodes());
        document.getElementById('downloadAllBtn').addEventListener('click', () => this.downloadAllAsZip());
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (e) => this.parseCSV(e.target.result);
            reader.readAsText(file);
        } else {
            alert('Please select a valid CSV file.');
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        console.log('CSV Headers:', headers);
        
        this.csvData = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            
            // Skip empty rows
            if (values.every(v => !v || v.trim() === '')) {
                continue;
            }
            
            const row = {};
            headers.forEach((header, index) => {
                const normalizedHeader = header.toLowerCase().trim();
                row[normalizedHeader] = (values[index] || '').trim();
            });
            this.csvData.push(row);
        }
        
        console.log('Parsed CSV Data:', this.csvData);
        this.displayDataTable(headers);
        document.getElementById('previewSection').style.display = 'block';
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values;
    }

    displayDataTable(headers) {
        const tableHead = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');
        
        // Create table headers
        tableHead.innerHTML = '';
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);
        
        // Create table rows
        tableBody.innerHTML = '';
        this.csvData.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const normalizedHeader = header.toLowerCase().trim();
                td.textContent = row[normalizedHeader] || '';
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    generateVCardData(data) {
        // Extract data from CSV row
        const name = (data.name || '').trim();
        const title = (data.title || '').trim();
        const email = (data.email || '').trim();
        const phone = (data.phone || data['business phone number'] || '').trim();
        const organization = (data.organization || data.org || '').trim();
        const website = (data.website || data.url || '').trim();
        const address = (data.address || data.addr || '').trim();
        
        // Parse name into first and last name
        let firstName = '';
        let lastName = '';
        if (name) {
            const nameParts = name.trim().split(/\s+/);
            if (nameParts.length > 0) {
                firstName = nameParts[0];
                if (nameParts.length > 1) {
                    lastName = nameParts.slice(1).join(' ');
                }
            }
        }
        
        // Build vCard 3.0 format
        const vcardLines = [
            'BEGIN:VCARD',
            'VERSION:3.0'
        ];
        
        // N field (structured name) is required - format: LastName;FirstName;MiddleNames;Prefix;Suffix
        if (firstName || lastName) {
            vcardLines.push(`N:${lastName};${firstName};;;`);
        }
        
        // FN field (formatted/display name) is required
        if (name) {
            vcardLines.push(`FN:${name}`);
        }
        
        // Organization field - use proper format with semicolon separator
        if (organization) {
            vcardLines.push(`ORG:${organization};`);
        }
        
        // Title/Position
        if (title) {
            vcardLines.push(`TITLE:${title}`);
        }
        
        // Contact information
        if (phone) {
            vcardLines.push(`TEL;TYPE=WORK,VOICE:${phone}`);
        }
        
        if (email) {
            vcardLines.push(`EMAIL;TYPE=WORK:${email}`);
        }
        
        if (address) {
            vcardLines.push(`ADR;TYPE=WORK:;;${address};;;;`);
        }
        
        if (website) {
            vcardLines.push(`URL:${website}`);
        }
        
        vcardLines.push('END:VCARD');
        
        const vcard = vcardLines.join('\n');
        console.log(`Generated vCard for ${name}:`, vcard);
        return vcard;
    }

    async generateQRCode(vCardData, size = 400) {
        return new Promise((resolve, reject) => {
            const tempContainer = document.createElement('div');
            tempContainer.style.display = 'none';
            document.body.appendChild(tempContainer);
            
            try {
                new QRCode(tempContainer, {
                    text: vCardData,
                    width: size,
                    height: size,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                
                setTimeout(() => {
                    const img = tempContainer.querySelector('img');
                    if (img && img.src) {
                        resolve(img.src);
                    } else {
                        reject(new Error('QR code image not generated'));
                    }
                    document.body.removeChild(tempContainer);
                }, 100);
            } catch (error) {
                document.body.removeChild(tempContainer);
                reject(error);
            }
        });
    }

    async generateAllQRCodes() {
        if (this.csvData.length === 0) {
            alert('No data to generate QR codes from.');
            return;
        }
        
        document.getElementById('generateAllBtn').disabled = true;
        document.getElementById('generateAllBtn').textContent = 'Generating...';
        
        this.generatedQRCodes = [];
        const qrGrid = document.getElementById('qrGrid');
        qrGrid.innerHTML = '';
        
        for (let i = 0; i < this.csvData.length; i++) {
            const data = this.csvData[i];
            const name = data.name || `Contact ${i + 1}`;
            
            console.log(`Generating QR code ${i + 1}/${this.csvData.length} for ${name}`);
            
            try {
                const vCardData = this.generateVCardData(data);
                const qrCodeImage = await this.generateQRCode(vCardData, 400);
                
                this.generatedQRCodes.push({
                    name: name,
                    image: qrCodeImage
                });
                
                // Display QR code in grid
                const qrItem = document.createElement('div');
                qrItem.className = 'qr-item';
                
                const qrImage = document.createElement('img');
                qrImage.src = qrCodeImage;
                qrImage.alt = `QR Code for ${name}`;
                
                const qrName = document.createElement('h4');
                qrName.textContent = name;
                
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'download-btn';
                downloadBtn.textContent = 'Download PNG';
                downloadBtn.onclick = () => this.downloadQRCode(name, qrCodeImage);
                
                qrItem.appendChild(qrImage);
                qrItem.appendChild(qrName);
                qrItem.appendChild(downloadBtn);
                qrGrid.appendChild(qrItem);
                
            } catch (error) {
                console.error(`Error generating QR code for ${name}:`, error);
            }
        }
        
        document.getElementById('generateAllBtn').disabled = false;
        document.getElementById('generateAllBtn').innerHTML = '<span class="btn-icon">📱</span>Generate QR Codes';
        document.getElementById('downloadSection').style.display = 'block';
        document.getElementById('downloadAllBtn').style.display = 'inline-block';
        
        console.log(`Successfully generated ${this.generatedQRCodes.length} QR codes`);
    }

    downloadQRCode(name, imageDataUrl) {
        const link = document.createElement('a');
        link.download = `${name}_vCard_QR.png`;
        link.href = imageDataUrl;
        link.click();
    }

    async downloadAllAsZip() {
        if (this.generatedQRCodes.length === 0) {
            alert('No QR codes to download.');
            return;
        }
        
        document.getElementById('downloadAllBtn').disabled = true;
        document.getElementById('downloadAllBtn').textContent = 'Creating ZIP...';
        
        try {
            const zip = new JSZip();
            const folder = zip.folder('vCard_QR_Codes');
            
            for (const qrCode of this.generatedQRCodes) {
                // Convert data URL to blob
                const response = await fetch(qrCode.image);
                const blob = await response.blob();
                const fileName = `${qrCode.name}_vCard_QR.png`.replace(/[/\\?%*:|"<>]/g, '-');
                folder.file(fileName, blob);
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'vCard_QR_Codes.zip';
            link.click();
            
            document.getElementById('downloadAllBtn').disabled = false;
            document.getElementById('downloadAllBtn').innerHTML = '<span class="btn-icon">📦</span>Download All as ZIP';
            
        } catch (error) {
            console.error('Error creating ZIP file:', error);
            alert('Error creating ZIP file. Please try again.');
            document.getElementById('downloadAllBtn').disabled = false;
            document.getElementById('downloadAllBtn').innerHTML = '<span class="btn-icon">📦</span>Download All as ZIP';
        }
    }
}

// Initialize the generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VCardQRGenerator();
});

