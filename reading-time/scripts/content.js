function renderReadingTime(article){
    // missing article -> return nothing
    if (!article){
        return; 
    }

    const text = article.textContent;   // extract all text inside article
    const wordMatchRegExp = /[^\s]+/g;
        // regular expression: /.../ start and end 
        // [^\s]: code pattern: find all groups of characters that aren’t spaces
        //        ^ : not
        //        \s: whitespace character, i.e. spaces, tabs, or newlines
        // g : global --> find all matches
    const words = text.matchAll(wordMatchRegExp);
    // .matchAll returns iteration over all matches with regex
    
    const wordCnt = [...words].length;
    // spread syntax (...) converts iterator words into array and get word count
    const readingTime = Math.round(wordCnt/200);
    // reading speed: 200 words/minute
    const badge = document.createElement("p");

    badge.classList.add("color-secondary-text","type--caption");
    // use the same styling as the publish information in article's header
    badge.textContent = `⏱️ ${readingTime} min read`;

    // support API reference docs
    const heading = article.querySelector("h1");
    // support article docs with date
    const date = article.querySelector("time")?.parentNode;
    // Optional chaining (?.) to get parent of <time> (if it exists)
    // Like chaining operator (.) but instead of throwing an error
    // if <time> is null, it return 'undefined' value.

    (date ?? heading).insertAdjacentElement("afterend", badge);
    // Nullish coalescing (??) 
    //    If date exists → use it
    //    Else → use heading
    // element.insertAdjacentElement(position, newElement)
    //    position:
    //          beforebegin <new><element></element> 
    //          afterbegin  <element><new>...</new></element>
    //          beforeend   <element>...<new></new></element>
    //          afterend    <element></element><new>

    const observer = new MutationObserver((mutations) =>{
        // MutationObserver watches for changes in the DOM
    for(const mutation of mutations) {
        // If a new article was added.
        for (const node of mutation.addedNodes) {
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
    // Tells the observer what to watch:
    // The element <devsite-content> (the container for articles)
    // childList: true means “watch for new child nodes being added/removed”
}

renderReadingTime(document.querySelector("article"));