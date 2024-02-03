/** Convert HTML to a plaintext representation, preserving whitespace. */
// NB: This function can still return unsafe HTML
export const unescapeHTML = (html: string = ''): string => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.replace(/<br\s*\/?>/g, '\n').replace(/<\/p><[^>]*>/g, '\n\n').replace(/<[^>]*>/g, '');
    return wrapper.textContent || '';
  };
  