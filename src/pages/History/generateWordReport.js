import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import axios from "axios";

const generateWordReport = async (sessionData, session, earliest, latest) => {
  if (!sessionData) {
    console.warn("No session data provided.");
    return;
  }

  try {
    // Load the .docx template
    const response = await axios.get("/template.docx", {
      responseType: "arraybuffer",
    });
    const zip = new PizZip(response.data);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Group entries by priority
    const groupByPriority = (priority) =>
      sessionData.sessionEntries.filter(
        (entry) => entry.priority && entry.priority.toLowerCase() === priority
      );

    const highPriorityEntries = groupByPriority("high");
    const moderatePriorityEntries = groupByPriority("moderate");
    const otherEntries = groupByPriority("low");

    // Prepare the document content with correct keys
    const docContent = {
      childName: `${sessionData.child?.firstName || ""} ${sessionData.child?.lastName || ""}`.trim() || "Unknown Child",
      session: session || "N/A",
      date: earliest ? earliest.toLocaleDateString() : new Date().toLocaleDateString(),
      highPriorityDomains: highPriorityEntries.map((entry) => ({
        domainName: entry.domainname || "N/A",  // Ensure domainname is correct
        clinicalPrompt: entry.clinicalPrompt || "No clinical prompt provided.",
        formulation: entry.formulation || "No formulation provided.",
        recommendation: entry.recommendation || "No recommendation provided.",
      })),
      moderatePriorityDomains: moderatePriorityEntries.map((entry) => ({
        domainName: entry.domainname || "N/A",  // Ensure domainname is correct
        clinicalPrompt: entry.clinicalPrompt || "No clinical prompt provided.",
        formulation: entry.formulation || "No formulation provided.",
        recommendation: entry.recommendation || "No recommendation provided.",
      })),
      otherDomains: otherEntries.map((entry) => ({
        domainName: entry.domainname || "N/A",  // Ensure domainname is correct
        clinicalPrompt: entry.clinicalPrompt || "No clinical prompt provided.",
        formulation: entry.formulation || "No formulation provided.",
        recommendation: entry.recommendation || "No recommendation provided.",
      })),
    };    

    // Log the docContent for debugging purposes
    console.log("Document content:", docContent);

    // Populate the template with data
    doc.setData(docContent);

    try {
      // Render and save the document
      doc.render();
      const blob = doc.getZip().generate({ type: "blob" });
      const fileName = `Session_${session}_Summary_${docContent.childName.replace(" ", "_")}.docx`;
      saveAs(blob, fileName);
      console.log(`Document "${fileName}" generated successfully.`);
    } catch (renderError) {
      console.error("Error generating document:", renderError.message || renderError);
    }
  } catch (templateError) {    
    console.error("Error loading or processing template:", templateError.message || templateError);
  }
};

export default generateWordReport;
