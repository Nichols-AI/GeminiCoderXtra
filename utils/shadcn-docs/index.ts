import { name as avatarName, importDocs as avatarImport } from "./avatar";
import { name as buttonName, importDocs as buttonImport } from "./button";
import { name as cardName, importDocs as cardImport } from "./card";
import { name as inputName, importDocs as inputImport } from "./input";
import { name as labelName, importDocs as labelImport } from "./label";
import { name as radioGroupName, importDocs as radioGroupImport } from "./radio-group";
import { name as selectName, importDocs as selectImport } from "./select";
import { name as textareaName, importDocs as textareaImport } from "./textarea";

const shadcnDocs = [
  `// ${avatarName} Component\n${avatarImport}`,
  `// ${buttonName} Component\n${buttonImport}`,
  `// ${cardName} Component\n${cardImport}`,
  `// ${inputName} Component\n${inputImport}`,
  `// ${labelName} Component\n${labelImport}`,
  `// ${radioGroupName} Component\n${radioGroupImport}`,
  `// ${selectName} Component\n${selectImport}`,
  `// ${textareaName} Component\n${textareaImport}`,
];

export default shadcnDocs;
