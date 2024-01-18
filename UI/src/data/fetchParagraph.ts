

async function fetchParagraph(paragraphs: number, sentences: number) {

    if (sentences >= 40) {
        sentences = 40
    } else if (sentences <= 10) {
        sentences = 10
    }
    
    const data = await fetch(`https://baconipsum.com/api/?type=all-meat&paras=${paragraphs}&sentences=${sentences}`);
    const result = await data.json();
    return result;
}

export default fetchParagraph;