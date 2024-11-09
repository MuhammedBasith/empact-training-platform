export function markdownToText(markdown: string): string {
    // Remove markdown headers (e.g., # Header, ## Subheader)
    let plainText = markdown.replace(/^(#{1,6})\s*(.*)$/gm, (_, level, content) => {
        // Remove header markers and preserve the content
        return `${content.trim()}`;
    });

    // Remove bullet points (e.g., * Item or - Item)
    plainText = plainText.replace(/^\s*[\*\-\+]?\s*(.*)$/gm, (_, content) => {
        // Preserve list items as plain text, add a bullet point symbol
        return `• ${content.trim()}`;
    });

    // Remove links (e.g., [Link](url))
    plainText = plainText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Remove code blocks (e.g., `inline code` and ```code block```)
    plainText = plainText.replace(/`([^`]+)`/g, '$1');
    plainText = plainText.replace(/```([\s\S]*?)```/g, (match, p1) => {
        return p1.replace(/\n/g, ' ').trim(); // collapse multiline code blocks
    });

    // Optionally, remove image markdown or anything else specific
    plainText = plainText.replace(/!\[.*?\]\(.*?\)/g, '');

    // Remove other extraneous Markdown syntax
    plainText = plainText.replace(/\*\*(.*?)\*\*/g, '$1');  // Remove bold (**) syntax
    plainText = plainText.replace(/\*(.*?)\*/g, '$1');      // Remove italic (*) syntax

    // Return the cleaned plain text
    return plainText.trim();
}
