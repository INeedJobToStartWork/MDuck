import { NodeHtmlMarkdown } from "node-html-markdown";
import { bundleMDX } from "mdx-bundler";
import type { BundleMDX } from "mdx-bundler/dist/types";
import { getMDXComponent } from "mdx-bundler/client/index.js";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const htmlToMarkdown = new NodeHtmlMarkdown({ preferNativeParser: true });

/**
 * Converts MDX to Markdown. This is useful for rendering dynamic README.md files.
 *
 * @example
 * import { resolve } from "path"
 * import { mdxToMd } from "mdx-to-md"
 *
 * const markdown = await mdxToMd(resolve(process.cwd(), "README.mdx"))
 */
export async function mdxToMd<Frontmatter extends Record<string, any>>(
	/** The path to the MDX file. */
	filePath: string,
	/** Optional output path for the markdown file */
	outputPath?: string,
	/** Configure internal library options. */
	options?: Pick<BundleMDX<Frontmatter>, "esbuildOptions" | "grayMatterOptions" | "mdxOptions">
): Promise<void> {
	const absoluteFilePath = resolve(filePath);

	const contents = await readFile(absoluteFilePath, "utf-8");
	const { code } = await bundleMDX({
		source: contents,
		cwd: dirname(absoluteFilePath),
		...options,
		esbuildOptions: esbuildOptions => ({
			...esbuildOptions,
			platform: "node",
			external: ["react", "react-dom"],
			...options?.esbuildOptions
		})
	});
	const component = getMDXComponent(code);
	const element = createElement(component);
	const html = renderToString(element);
	if (outputPath) await writeFile(outputPath, html);
	return html;
}
