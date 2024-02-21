

async function fetch_paragraph(paras: number) {
    const data = await fetch(`https://baconipsum.com/api/?type=all-meat&paras=${paras}`);
    const array = await data.json();
    const result: string[] = [];
    for (let i = 0; i < array.length; i++) {
        result.push(array[i].replace(/\. /g, ""));
    }
    return result;
}

export default fetch_paragraph;