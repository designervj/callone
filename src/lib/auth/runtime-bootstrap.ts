export function shouldRunWorkspaceSeedData() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.CALLONE_RUNTIME_BOOTSTRAP === "true"
  );
}
