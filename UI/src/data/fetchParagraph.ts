

async function fetchParagraph(sentences: number) {
    if (sentences >= 40) {
        sentences = 40
    } else if (sentences <= 10) {
        sentences = 10
    }
    
    const data = await fetch(`https://baconipsum.com/api/?type=all-meat&sentences=${sentences}`);
    const array = await data.json();
    const result = array[0].split('. ');
    result.pop()
    return result;
}

export default fetchParagraph;