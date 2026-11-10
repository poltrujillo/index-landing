// Progressive enhancement: the full selectable email and mailto work without JS.
const copyButton = document.querySelector('[data-copy-address]');
const feedback = document.getElementById('copy-feedback');
if (copyButton && feedback) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard is unavailable');
      await navigator.clipboard.writeText(copyButton.dataset.copyAddress);
      feedback.textContent = copyButton.dataset.copySuccess;
    } catch {
      const address = document.getElementById('deletion-address');
      address?.focus();
      if (address && window.getSelection && document.createRange) {
        const range = document.createRange();
        range.selectNodeContents(address);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      feedback.textContent = copyButton.dataset.copyFailure;
    }
  });
}
