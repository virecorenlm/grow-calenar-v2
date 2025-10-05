import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
export async function generatePdfReport(
  elementId: string,
  growName: string,
  strainName: string
): Promise<void> {
  const input = document.getElementById(elementId);
  if (!input) {
    toast.error('Could not find the content to generate PDF.');
    return;
  }
  const toastId = toast.loading('Generating PDF report...');
  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: null, // Use element's background
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const newImgWidth = pdfWidth - 20; // with some margin
    const newImgHeight = newImgWidth / ratio;
    let heightLeft = newImgHeight;
    let position = 10; // top margin
    pdf.setFontSize(22);
    pdf.text(`${growName} - ${strainName}`, pdfWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Grow Log Report', pdfWidth / 2, 30, { align: 'center' });
    position = 40;
    pdf.addImage(imgData, 'PNG', 10, position, newImgWidth, newImgHeight);
    heightLeft -= (pdfHeight - position);
    while (heightLeft >= 0) {
      position = heightLeft - newImgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, newImgWidth, newImgHeight);
      heightLeft -= pdfHeight;
    }
    pdf.save(`${growName.replace(/\s+/g, '_')}_report.pdf`);
    toast.success('PDF report downloaded successfully!', { id: toastId });
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF report.', { id: toastId });
  }
}