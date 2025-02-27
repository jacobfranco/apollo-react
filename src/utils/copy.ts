const copy = (text: string, onSuccess?: () => void) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);

    if (onSuccess) {
      onSuccess();
    }
  } else {
    const textarea = document.createElement("textarea");

    textarea.textContent = text;
    textarea.style.position = "fixed";

    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand("copy");
    } catch {
      // Do nothing
    } finally {
      document.body.removeChild(textarea);

      if (onSuccess) {
        onSuccess();
      }
    }
  }
};

export default copy;

const STORAGE_KEY = "copied_statuses";

export function getCopiedStatuses(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch (e) {
    return new Set();
  }
}

export function markStatusAsCopied(statusId: string): void {
  try {
    const copiedStatuses = getCopiedStatuses();
    copiedStatuses.add(statusId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...copiedStatuses]));
  } catch (e) {
    // Fail silently - not critical functionality
  }
}
