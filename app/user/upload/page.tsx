'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  IconArrowLeft,
  IconReceipt,
  IconUpload,
  IconCheck,
  IconLoader2,
  IconX,
  IconCurrencyRupee,
  IconCalendarEvent,
  IconShoppingCart,
  IconAlertCircle,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { supabase, BUCKET_NAME, FOLDER_PATH } from '@/lib/supabase';

const expenseTypes = [
  'Food & Drinks',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Education',
  'Other',
];

// Function to extract information from OCR text
const extractReceiptInfo = (text: string) => {
  if (!text) return { amount: '', date: '', type: 'Shopping', name: '' };

  console.log('OCR Text for extraction:', text.substring(0, 300) + '...');

  // Extract amount - improved regex patterns to catch more formats
  let amount = '';

  // Try different total formats
  const totalPatterns = [
    /Total\s*:?\s*Rp\.?\s*([\d.,]+)/i,
    /Total\s*:?\s*([\d.,]+)/i,
    /Total\s*:?\s*IDR\s*([\d.,]+)/i,
    /Total\s*:?\s*RP\s*([\d.,]+)/i,
    /TOTAL\s*:?\s*([\d.,]+)/i,
    /Subtotal\s*:?\s*([\d.,]+)/i,
    /SUBTOTAL\s*:?\s*([\d.,]+)/i,
  ];

  for (const pattern of totalPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      amount = match[1].replace(/[.,]/g, '');
      console.log(`Found amount using pattern ${pattern}: ${amount}`);
      break;
    }
  }

  // If still no amount found, try looking for currency symbols with numbers
  if (!amount) {
    const currencyMatch = text.match(/(?:Rp\.?|IDR)\s*([\d.,]+)/i);
    if (currencyMatch && currencyMatch[1]) {
      amount = currencyMatch[1].replace(/[.,]/g, '');
      console.log(`Found amount using currency symbol: ${amount}`);
    }
  }

  // Extract date - improved date extraction
  let date = new Date().toISOString().split('T')[0]; // Default to today

  // Try to extract date from "Tanggal" field (common in Indonesian receipts)
  const tanggalMatch = text.match(
    /Tanggal\s*:?\s*(\d{2}[-\.\/]\d{2}[-\.\/]\d{2,4})/i
  );
  if (tanggalMatch && tanggalMatch[1]) {
    date = formatDateString(tanggalMatch[1]);
    console.log(`Found date from Tanggal field: ${tanggalMatch[1]} → ${date}`);
  } else {
    // Look for common date formats
    const datePatterns = [
      /(\d{4}-\d{2}-\d{2})/, // YYYY-MM-DD
      /(\d{2}-\d{2}-\d{4})/, // DD-MM-YYYY
      /(\d{2}\/\d{2}\/\d{4})/, // DD/MM/YYYY
      /(\d{2} [A-Za-z]{3} \d{2,4})/, // DD MMM YY or DD MMM YYYY
    ];

    // Try to find receipt date
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        date = formatDateString(match[1]);
        break;
      }
    }

    // Try to find month and day mentions
    if (date === new Date().toISOString().split('T')[0]) {
      const monthMatch = text.match(
        /(\d{1,2})[ \/.-]([A-Za-z]{3,})[ \/.-](\d{2,4})/i
      );
      if (monthMatch) {
        const possibleDate = parseMonthTextDate(monthMatch[0]);
        if (possibleDate) {
          date = possibleDate;
        }
      }
    }
  }

  // Try to determine type based on common keywords
  let type = 'Shopping';
  if (
    text.match(
      /restaurant|resto|cafe|food|makanan|minuman|drink|coffee|kopi|breadtalk|bread|bakery/i
    )
  ) {
    type = 'Food & Drinks';
  } else if (
    text.match(/transport|travel|bus|train|kereta|taksi|taxi|gojek|grab/i)
  ) {
    type = 'Transportation';
  } else if (
    text.match(/mart|shop|store|toko|mall|supermarket|market|retail|outlet/i)
  ) {
    type = 'Shopping';
  } else if (
    text.match(/movie|film|entertainment|game|bioskop|cinema|theater/i)
  ) {
    type = 'Entertainment';
  } else if (
    text.match(/bill|utility|listrik|air|internet|phone|pulsa|pln|gas|data/i)
  ) {
    type = 'Bills & Utilities';
  } else if (
    text.match(
      /hospital|doctor|apotek|pharmacy|clinic|klinik|obat|medicine|farma|farmasi|medis|medical/i
    )
  ) {
    type = 'Health';
  } else if (
    text.match(
      /school|course|class|books|buku|university|college|training|education/i
    )
  ) {
    type = 'Education';
  }

  // Try to extract a meaningful name/description from the receipt
  let name = '';

  // Look for store/merchant names (usually at the top of receipts)
  const merchantPatterns = [
    /^([A-Z][A-Za-z\s&.,-]+)(?:\n|\r)/m, // First line that starts with capital letter
    /(?:Toko|Store|Restaurant|Resto|Cafe|Shop)\s*:?\s*([A-Za-z\s&.,-]+)/i,
    /([A-Z][A-Za-z\s&.,-]{2,20})(?:\s*(?:Cabang|Branch|Store))/i,
  ];

  for (const pattern of merchantPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      name = match[1].trim();
      console.log(`Found merchant name: ${name}`);
      break;
    }
  }

  // If no merchant name found, try to get a generic description based on type
  if (!name) {
    const lines = text.split('\n').filter((line) => line.trim().length > 0);
    // Get the first meaningful line (usually merchant name)
    for (const line of lines.slice(0, 3)) {
      if (
        line.trim().length > 3 &&
        !line.match(/\d{2}[-\/]\d{2}[-\/]\d{2,4}/) &&
        !line.toLowerCase().includes('receipt')
      ) {
        name = line.trim();
        break;
      }
    }
  }

  // Fallback: create a default name based on type
  if (!name) {
    const typeNames = {
      'Food & Drinks': 'Food Purchase',
      Transportation: 'Transport Expense',
      Shopping: 'Shopping Expense',
      Entertainment: 'Entertainment Expense',
      'Bills & Utilities': 'Utility Bill',
      Health: 'Health Expense',
      Education: 'Education Expense',
      Other: 'Other Expense',
    };
    name = typeNames[type as keyof typeof typeNames] || 'General Expense';
  }

  console.log('Extracted receipt info:', { amount, date, type, name });
  return { amount, date, type, name };
};

// Helper function to format date strings into YYYY-MM-DD
const formatDateString = (dateStr: string): string => {
  try {
    // Handle different date formats
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Already in YYYY-MM-DD format
      return dateStr;
    }

    // Convert DD-MM-YYYY or DD/MM/YYYY to YYYY-MM-DD
    if (dateStr.match(/^\d{2}[-\/\.]\d{2}[-\/\.]\d{4}$/)) {
      const parts = dateStr.split(/[-\/\.]/);
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // Handle DD-MM-YY or DD/MM/YY format (two-digit year)
    if (dateStr.match(/^\d{2}[-\/\.]\d{2}[-\/\.]\d{2}$/)) {
      const parts = dateStr.split(/[-\/\.]/);
      const day = parts[0];
      const month = parts[1];
      let year = parseInt(parts[2]);

      // Convert two-digit year to four-digit year
      year = year < 50 ? 2000 + year : 1900 + year;

      return `${year}-${month}-${day}`;
    }

    // Try to parse with Date object
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    console.error('Error parsing date:', e);
  }

  // Return today's date if parsing fails
  return new Date().toISOString().split('T')[0];
};

// Helper to parse dates with month names (e.g., "10 May 19")
const parseMonthTextDate = (dateText: string): string | null => {
  try {
    const months: { [key: string]: number } = {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      mei: 4,
      jun: 5,
      june: 5,
      juni: 5,
      jul: 6,
      july: 6,
      juli: 6,
      aug: 7,
      august: 7,
      agustus: 7,
      sep: 8,
      september: 8,
      oct: 9,
      october: 9,
      oktober: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11,
      desember: 11,
    };

    // Extract parts (day, month, year)
    const parts = dateText.trim().split(/[\s\/.-]+/);
    if (parts.length < 3) return null;

    let day, month, year;

    // Try to determine which part is the month
    for (let i = 0; i < parts.length; i++) {
      const lowercasePart = parts[i].toLowerCase();
      if (months[lowercasePart] !== undefined) {
        month = months[lowercasePart] + 1; // Convert to 1-based month
        day = parseInt(parts[i - 1]) || parseInt(parts[i + 1]);
        year = parseInt(parts[i + 1]) || parseInt(parts[i - 1]);

        if (isNaN(day) || isNaN(year)) {
          // Try other positions if day/year not found
          const remainingParts = parts.filter((_, idx) => idx !== i);
          day = parseInt(remainingParts[0]);
          year = parseInt(remainingParts[1]);
        }
        break;
      }
    }

    // If no month name found, return null
    if (!month) return null;

    // Fix two-digit years
    if (year !== undefined && year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    } else if (year === undefined) {
      year = new Date().getFullYear(); // Default to current year if undefined
    }

    // Ensure valid day, month, and year
    if (day && month && year) {
      return `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
    }
  } catch (e) {
    console.error('Error parsing text date:', e);
  }

  return null;
};

export default function UploadStrukPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    name: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  // Convert any image file to JPG format as required by the RLS policy
  const convertToJpeg = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Only convert if file is not already a JPG
      if (file.type === 'image/jpeg') {
        resolve(file);
        return;
      }

      // Create an image element to load the file
      const img = new Image();
      img.onload = () => {
        // Create canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }

        // Draw with white background to handle transparency
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not convert to JPEG'));
              return;
            }

            // Create new file with jpg extension
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
            const jpegFile = new File([blob], `${nameWithoutExt}.jpg`, {
              type: 'image/jpeg',
            });
            resolve(jpegFile);
          },
          'image/jpeg',
          0.95
        ); // 95% quality
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for conversion'));
      };

      // Load the image from the file
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const proceedToDetails = () => {
    if (selectedFile) {
      uploadImageAndProcess();
    } else {
      toast.error('Please select a receipt image first');
    }
  };

  const uploadImageAndProcess = async () => {
    if (!selectedFile) {
      toast.error('Please select a receipt image first');
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      // Convert file to JPEG format as required by RLS policy
      const jpegFile = await convertToJpeg(selectedFile);

      // Generate a unique filename to avoid collisions
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);

      // Create a clean filename with .jpg extension as required by RLS policy
      // RLS policy requires: storage.extension(name) = 'jpg'
      const safeFileName = `receipt_${timestamp}_${randomString}.jpg`;

      // RLS policy requires: lower((storage.foldername(name))[1]) = 'public'
      // So we need 'public' as the first folder level
      const fileName = `${FOLDER_PATH}/${safeFileName}`;

      console.log('Attempting to upload to path:', fileName);

      // Upload to the bucket with public folder path
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, jpegFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg', // Explicitly set content type to JPEG
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setUploadError(`Upload error: ${uploadError.message}`);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful, data:', uploadData);

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      const publicUrl = urlData.publicUrl;
      setImageUrl(publicUrl);
      console.log('File uploaded successfully, public URL:', publicUrl);

      // 2. Send to OCR processing
      const userId = session?.user?.id || 'anonymous';
      const response = await fetch('/api/ocr_read/extract_ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: publicUrl,
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process receipt');
      }

      const data = await response.json();
      console.log('OCR processing result:', data);

      // Get the receipt details from the API response
      try {
        // Get the receipt data with the extracted text
        const receiptResponse = await fetch(`/api/struk/${data.id}`, {
          method: 'GET',
        });

        if (receiptResponse.ok) {
          const receiptData = await receiptResponse.json();
          console.log('Receipt data:', receiptData);

          if (receiptData.success && receiptData.data) {
            const extractedText = receiptData.data.extracted_text || '';
            setExtractedText(extractedText);

            // Extract information from OCR text
            const extractedInfo = extractReceiptInfo(extractedText);

            // Set form data with extracted information including name
            setFormData({
              type: extractedInfo.type || 'Shopping',
              amount: extractedInfo.amount || '',
              date:
                extractedInfo.date || new Date().toISOString().split('T')[0],
              name: extractedInfo.name || '',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching receipt details:', err);
        // Continue anyway as this is just for prefilling the form
      }

      // Store the receipt ID from OCR processing
      setReceiptId(data.id);

      // Show the modal to confirm details
      setShowModal(true);
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to process receipt. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeReceipt = async () => {
    if (!receiptId || !formData.type) {
      toast.error('Missing receipt information');
      return;
    }

    setIsUploading(true);

    try {
      // Update the receipt record with final details including name
      const response = await fetch(`/api/struk/${receiptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          amount: formData.amount ? parseFloat(formData.amount) : undefined,
          date: formData.date,
          name: formData.name || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update receipt details');
      }

      // Success
      setUploadSuccess(true);
      toast.success('Receipt processed successfully');

      // Redirect back to dashboard after a delay
      setTimeout(() => {
        router.push('/user');
      }, 2000);
    } catch (error) {
      console.error('Error finalizing receipt:', error);
      toast.error('Failed to save receipt details. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    // If there's an uploaded image URL, attempt to delete it from storage
    if (imageUrl) {
      try {
        // Extract the path from the URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const folderPath = `${FOLDER_PATH}/${fileName}`;

        // Delete the file (no need to await, we can let this happen in background)
        supabase.storage
          .from(BUCKET_NAME)
          .remove([folderPath])
          .then(({ error }) => {
            if (error) {
              console.error('Failed to delete uploaded file:', error);
            } else {
              console.log('Successfully deleted uploaded file');
            }
          });
      } catch (err) {
        console.error('Error attempting to delete file:', err);
      }
    }

    setSelectedFile(null);
    setImagePreview(null);
    setShowModal(false);
    setReceiptId(null);
    setImageUrl(null);
    setExtractedText(null);
    setUploadError(null);
    setFormData({
      type: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      name: '',
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          Upload Receipt
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/user')}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-1"
        >
          <IconArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <IconReceipt
                className="text-blue-600 dark:text-blue-400"
                size={16}
              />
            </div>
            Receipt Scan & Upload
          </CardTitle>
          <CardDescription>
            Upload your receipt image for automatic processing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-900">
          {!uploadSuccess ? (
            <>
              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
                  <IconAlertCircle className="shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium">Upload Error</p>
                    <p>{uploadError}</p>
                    <p className="mt-1 text-xs">
                      Note: Due to storage policy, only JPG files are supported.
                      Your image will be automatically converted.
                    </p>
                  </div>
                </div>
              )}

              <div
                className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={!isProcessing ? openFileSelector : undefined}
              >
                <input
                  ref={fileInputRef}
                  id="receipt"
                  name="receipt"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />

                {isProcessing ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="animate-spin mb-4">
                      <IconLoader2
                        size={48}
                        className="text-blue-500 dark:text-blue-400"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                      Processing Receipt...
                    </h3>
                    <p className="text-blue-500 dark:text-blue-400 max-w-sm">
                      We're analyzing your receipt and extracting the
                      information
                    </p>
                  </div>
                ) : imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative max-w-xs mx-auto">
                      <img
                        src={imagePreview}
                        alt="Receipt preview"
                        className="max-h-60 mx-auto rounded-md shadow-md"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <IconX size={16} />
                      </button>
                    </div>
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {selectedFile?.name}
                      {selectedFile && selectedFile.type !== 'image/jpeg' && (
                        <span className="text-xs text-blue-500 block mt-1">
                          (Will be converted to JPG format)
                        </span>
                      )}
                    </p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        proceedToDetails();
                      }}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      Process Receipt
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <IconUpload
                      size={48}
                      className="text-blue-500 dark:text-blue-400 mb-4"
                    />
                    <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                      Drag & Drop or Click to Upload
                    </h3>
                    <p className="text-blue-500 dark:text-blue-400 max-w-sm">
                      Upload a clear image of your receipt for automatic
                      scanning and expense tracking
                    </p>
                    <p className="text-xs text-blue-400 dark:text-blue-500 mt-4">
                      Supports JPG, PNG, or other common image formats (will be
                      converted to JPG)
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <IconCheck
                  size={32}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <h3 className="text-xl font-medium text-green-700 dark:text-green-300 mb-2">
                Receipt Processed Successfully!
              </h3>
              <p className="text-green-600 dark:text-green-400 text-center max-w-md">
                Your receipt has been processed and recorded in your expense
                history. Redirecting to dashboard...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for confirming receipt details */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-800 dark:text-blue-300">
              Confirm Receipt Details
            </DialogTitle>
            <DialogDescription>
              We've processed your receipt. Please confirm or edit the details
              below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Receipt Preview */}
            {imageUrl && (
              <div className="rounded-md overflow-hidden shadow-md mb-4">
                <img
                  src={imageUrl}
                  alt="Receipt"
                  className="w-full h-auto max-h-60 object-contain bg-gray-100 dark:bg-gray-800"
                />
              </div>
            )}

            {/* Extracted Information */}
            <div className="grid grid-cols-1 gap-4">
              {/* Custom Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-blue-800 dark:text-blue-300 flex items-center gap-2"
                >
                  <IconReceipt size={16} className="text-blue-500" />
                  Expense Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="border-blue-200 focus:ring-blue-500 dark:border-blue-800 dark:focus:ring-blue-600"
                  placeholder="Enter a custom name for this expense"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Give your expense a memorable name (e.g., "Lunch at
                  McDonald's", "Grocery Shopping")
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-blue-800 dark:text-blue-300 flex items-center gap-2"
                >
                  <IconShoppingCart size={16} className="text-blue-500" />
                  Expense Type
                </Label>
                <Select onValueChange={handleTypeChange} value={formData.type}>
                  <SelectTrigger className="border-blue-200 focus:ring-blue-500 dark:border-blue-900 dark:focus:ring-blue-600">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-blue-800 dark:text-blue-300 flex items-center gap-2"
                >
                  <IconCurrencyRupee size={16} className="text-blue-500" />
                  Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400 font-medium">
                    Rp
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    className="pl-10 border-blue-200 focus:ring-blue-500 dark:border-blue-800 dark:focus:ring-blue-600"
                    placeholder="0"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-blue-800 dark:text-blue-300 flex items-center gap-2"
                >
                  <IconCalendarEvent size={16} className="text-blue-500" />
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className="border-blue-200 focus:ring-blue-500 dark:border-blue-800 dark:focus:ring-blue-600"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              {/* Extracted Text (collapsed by default) */}
              {extractedText && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium">
                      View Extracted Text
                    </summary>
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {extractedText}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={cancelUpload}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={finalizeReceipt}
              disabled={isUploading || !formData.name.trim()}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {isUploading ? 'Saving...' : 'Confirm Details'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
