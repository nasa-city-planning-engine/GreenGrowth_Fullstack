import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

export default function DropDownMenuOfIndustries() {
  const industries = [
    "Electricity Generation", "Adipic Acid Production", "Aluminum Production",
    "Ammonia Manufacturing", "Cement Production", "Electronics Manufacture", "Ferroalloy Production",
    "Fluorinated GHG Production", "Glass Production", "HCFC-22 Production and HFC-23 Destruction",
    "Hydrogen Production", "Iron and Steel Production", "Lead Production", "Lime Production",
    "Magnesium Production", "Miscellaneous Use of Carbonates", "Nitric Acid Production",
    "Petrochemical Production", "Petroleum Refining", "Phosphoric Acid Production",
    "Pulp and Paper Manufacturing", "Silicon Carbide Production", "Soda Ash Manufacturing",
    "SF6 from Electrical Equipment", "Titanium Dioxide Production", "Underground Coal Mines",
    "Zinc Production", "Municipal Landfills", "Industrial Wastewater Treatment",
    "Industrial Waste Landfills", "Offshore Production", "Natural Gas Processing",
    "Natural Gas Transmission/Compression", "Underground Natural Gas Storage",
    "Liquified Natural Gas Storage", "Liquified Natural Gas Import/Export Equipment",
    "Petroleum Refinery (Producer)", "Petroleum Product Importer", "Petroleum Product Exporter",
    "Natural Gas Liquids Fractionator", "Natural Gas Local Distribution Company (supply)",
    "Non-CO2 Industrial Gas Supply", "Carbon Dioxide (CO2) Supply",
    "Import and Export of Equipment Containing Fluorinated GHGs",
    "Injection of Carbon Dioxide", "Electric Transmission and Distribution Equipment"
  ];

  return (
    <Accordion
      sx={{
        minWidth: 250,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        aria-controls="industries-content"
        id="industries-header"
        sx={{
          border: "1px solid black",
          borderRadius: "4px",
          color: "",
          backgroundColor: "white",
        }}
      >
        <Typography>Select Industries</Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          border: "1px solid #444",
          borderTop: "none",
          backgroundColor: "#ffffffff",
          padding: "8px 16px",
          maxHeight: 200, 
          overflowY: "auto", 
        }}
      >
        <FormGroup>
          {industries.map((industry, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  sx={{ color: "#007ac1ff" }}
                  disabled={false}
                />
              }
              label={
                <Typography
                  sx={{
                    color: "black" ,
                    whiteSpace: "normal", 
                    wordBreak: "break-word", 
                    maxWidth: "150px",
                    lineHeight: 1.2
                    
                  }}
                >
                  {industry}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
