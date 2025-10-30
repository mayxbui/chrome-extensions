function renderReadingTime(article){
    // No article
    if (!article){
        return;
    }

    const text = article.textContent;
    const wordMatchRegExp = /[^\s]+/g;
    // Regular expression
    const words = text.matchAll(wordMatchRegExp);
    // .matchAll reurns iteration, convert arr to get word count
    
    const wordCnt = [...words].length;
    const readingTime = Math.round(wordCnt/200);
    const badge = document.createElement("p");
    // use the same styling as the publish information in article's header

    badge.classList.add("color-secondary-text","type--caption");
    badge.textContent = `⏱️ ${readingTime} min read`;

    // support API reference docs
    const heading = article.querySelector("h1");
    // support article docs with date
    const date = article.querySelector("time")?.parentNode;
    // ?. means Optional Chaining. is like chaining operator (.) but instead of causing an error if condition is null, it return 'undefined' value.

    (date ?? heading).insertAdjacentElement("afterend", badge);
    // Nullish coalescing (??) returns <heading> ì the <date> is null or undefined

    const observer = new MutationObserver((mutations) =>{
    for(const mutation of mutations) {
        // If a new article was added.
        for (const node of mutation.addedNotes) {
            if (node instanceof Element && node.tagName === 'ARTICLE'){
                // Render the reading time for this particular article
                renderReadingTime(node);
                }
            }
        }
    })

    // https://developer.chrome.com/ is a SPA (Single Page Application) so can
    // update the address bar and render new content without reloading. Our content
    // script won't be reinjected when this happens, so we need to watch for
    // changes to the content.
    observer.observe(document.querySelector('devsite-content'), {
    childList: true
    });
}

renderReadingTime(document.querySelector("article"));