import fs from "node:fs";
import { parseWithOCRSpaceEnhanced } from "@/lib/ocr";

const buf = fs.readFileSync("Salaire Apr 2025.pdf");
parseWithOCRSpaceEnhanced(buf).then(r => console.log(r.ParsedText.slice(0, 500))); 