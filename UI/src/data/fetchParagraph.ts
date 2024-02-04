

async function fetchParagraph(paras: number) {
    
    /*const data = await fetch(`https://baconipsum.com/api/?type=all-meat&sentences=${sentences}`);
    const array = await data.json();
    const result = array[0].split('. ');
    result.pop()*/
    
    const data = await fetch(`https://baconipsum.com/api/?type=all-meat&paras=${paras}`);
    const array = await data.json();
    const result = array
    console.log(array)
    return result;
}

export default fetchParagraph;