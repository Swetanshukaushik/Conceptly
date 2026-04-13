export async function delay(ms: number) {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

