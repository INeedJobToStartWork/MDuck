import type { IOptionsConfig, IOptionsDebugger } from "../helpers";
import { optionConfig, optionDebugger } from "../helpers";
import { program } from "commander";

//----------------------
// Types
//----------------------

type TOutputType = "html" | "md" /**| "html+md"  */;

interface IOptionParams extends IOptionsDebugger, IOptionsConfig {
	input?: string;
	output?: string;
	outputFile: TOutputType;
}

//----------------------
// CLI APP
//----------------------

program
	.description("Execute MDuck application")
	.addOption(optionConfig)
	.addOption(optionDebugger)
	.action((paramsInput: IOptionParams) => {
		console.log("Quack, quack!");
	});
