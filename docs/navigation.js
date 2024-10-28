let availableKeywords = [
 'Who are AlCoders',
    'What is HTML',
    'What is CSS',
    'How to learn HTML',
    'How to learn CSS',
    'How to learn Python.What is its use',
    'What is JavaScript',
    'How to Learn JavaScript',
    'What is coding',
    'What is Arduino',
    'How to use Arduino',
    'Home',
];

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    if(input.length){
        result = availableKeywords.filter((keyword)=>{
           return  keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(result);
    }
    display(result);

    if(!result.length){
        resultsBox.innerHTML = '';
    }

}

function display(result){
    const content = result.map((list)=>{    
        return "<li onclick=selectInput(this)>" + list + "</li>";
});

    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}
function selectInput(list){
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
}











