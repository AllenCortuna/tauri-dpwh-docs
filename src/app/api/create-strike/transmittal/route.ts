import { readFile, writeBinaryFile } from "@tauri-apps/plugin-fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { formatNumber } from "../../../../../config/formatNumber";
import { formatDate } from "../../../../../config/convertToDate";

interface DocumentData {
  budget: string | number;
  date: string;
  contractID?: string;
  [key: string]: any;
}

export async function generateTransmittal(data: DocumentData): Promise<Uint8Array> {
  try {
    // Get the template path using Tauri's path API
    const templatePath = await join("resources", "3-STRIKE", "transmittal.docx");
    
    // Read the template file
    const transmittalTemplate = await readBinaryFile(templatePath);
    
    // Convert Uint8Array to binary string for PizZip
    const binaryString = new TextDecoder().decode(transmittalTemplate);
    const transmittalZip = new PizZip(binaryString);
    const transmittalOutputDoc = new Docxtemplater(transmittalZip);

    // Prepare data with formatted values
    const dataToAdd = {
      ...data,
      budget: formatNumber(data.budget),
      date: formatDate(data.date),
    };

    // Set data in the template
    transmittalOutputDoc.setData(dataToAdd);

    try {
      // Render the document
      transmittalOutputDoc.render();

      // Generate document as Uint8Array
      const outputBuffer = transmittalOutputDoc.getZip().generate({
        type: "uint8array",
      });

      return outputBuffer;
    } catch (error) {
      console.error("Error rendering document:", error);
      throw new Error(`Error rendering document: ${(error as Error).message}`);
    }
  } catch (error) {
    console.error("Error generating transmittal:", error);
    throw new Error(`Error generating transmittal: ${(error as Error).message}`);
  }
}

export async function saveTransmittal(
  documentBuffer: Uint8Array,
  fileName: string
): Promise<void> {
  try {
    // Get the download directory path
    const downloadPath = await join(
      await window.__TAURI__.path.downloadDir(),
      `${fileName}.docx`
    );

    // Write the file
    await writeBinaryFile(downloadPath, documentBuffer);
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error(`Error saving file: ${(error as Error).message}`);
  }
}

// Example frontend usage:
export async function handleTransmittalGeneration(data: DocumentData) {
  try {
    if (!data.contractID) {
      throw new Error("Contract ID is required");
    }

    // Generate the document
    const documentBuffer = await generateTransmittal(data);
    
    // Save the document
    await saveTransmittal(documentBuffer, `${data.contractID}_TRANSMITTAL`);
    
    return true;
  } catch (error) {
    console.error("Error in handleTransmittalGeneration:", error);
    throw error;
  }
}