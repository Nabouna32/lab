import { expect, test } from "@playwright/test";
test("converts multiple local images into a multi-page PDF", async ({ page }) => {
 await page.goto("/en/tools/image-to-pdf");
 const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=", "base64");
 await page.locator("#image-to-pdf-files").setInputFiles([{ name: "one.png", mimeType: "image/png", buffer: png }, { name: "two.png", mimeType: "image/png", buffer: png }]);
 await expect(page.getByRole("heading", { name: "Page order" })).toBeVisible(); await expect(page.getByText("one.png")).toBeVisible();
 const pending = page.waitForEvent("download"); await page.getByRole("button", { name: "Download PDF" }).click(); const download = await pending;
 expect(download.suggestedFilename()).toBe("loculary-images.pdf");
 const stream = await download.createReadStream(); expect(stream).not.toBeNull(); const chunks: Buffer[] = [];
 for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
 const pdf = Buffer.concat(chunks).toString("latin1"); expect(pdf.startsWith("%PDF-1.4")).toBe(true); expect(pdf).toContain("/Count 2");
});
