import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PdfExportOptions {
  filename?: string;
  title?: string;
  onProgress?: (status: string) => void;
}

/**
 * Captures an HTML element and downloads it as a polished, formatted PDF document.
 */
export async function exportElementToPdf(
  elementIdOrElement: string | HTMLElement,
  options: PdfExportOptions = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    options.onProgress?.("Locating element and preparing render canvas...");

    let targetElement: HTMLElement | null = null;
    if (typeof elementIdOrElement === "string") {
      targetElement = document.getElementById(elementIdOrElement);
    } else {
      targetElement = elementIdOrElement;
    }

    if (!targetElement) {
      throw new Error(`Target container element not found.`);
    }

    options.onProgress?.("Rendering high-resolution vector snapshot...");

    // Store original styles to ensure clean PDF export
    const isDark = document.documentElement.classList.contains("dark");

    // Capture using html2canvas with optimal settings
    const canvas = await html2canvas(targetElement, {
      scale: 2, // 2x crisp retina resolution
      useCORS: true,
      logging: false,
      backgroundColor: isDark ? "#060e06" : "#ffffff",
      windowWidth: targetElement.scrollWidth || 1280,
      windowHeight: targetElement.scrollHeight,
      onclone: (clonedDoc) => {
        // Remove interactive popups or sticky toolbars if any in clone
        const toolbars = clonedDoc.querySelectorAll(".no-print, [data-no-print='true']");
        toolbars.forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      },
    });

    options.onProgress?.("Generating formatted multi-page PDF...");

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    // Add subsequent pages if content exceeds single page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    const defaultName = `OmniRank_SEO_Overview_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    const finalFilename = options.filename || defaultName;

    options.onProgress?.("Saving PDF to your downloads...");
    pdf.save(finalFilename);

    return { success: true };
  } catch (err: any) {
    console.error("PDF Export Error:", err);
    return { success: false, error: err?.message || "Failed to generate PDF" };
  }
}
