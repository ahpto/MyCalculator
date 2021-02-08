//global variables:
const calculator = document.querySelector("#calculator");
const display = document.querySelector("#display");
const entry = document.querySelector("#entry");
const calc = document.querySelector("#calculator-border-wrap");
let entryText = document.createTextNode("");
let newArray = [];
let indexA = 0;
let indexA2 = 0;
let indexB = 0;
let indexB2 = 0;
let arrayNum1 = 0; 
let arrayNum2 = 0; 

//the following functions calculate operands in mathematically correct order (ie BEDMAS).
const multiDivi = (newArray) => {
    if (newArray.includes(decodeURI("%C3%97")) || newArray.includes(decodeURI("%C3%B7"))) {
        indexA = newArray.indexOf(decodeURI("%C3%97"));
        indexB = newArray.indexOf(decodeURI("%C3%B7"));
        if (indexB == -1 || (indexA > 0 && indexA < indexB)) {
            indexA2 = indexA-1;
            arrayNum1 = parseFloat(newArray[indexA2]);
            arrayNum2 = parseFloat(newArray[indexA+1]);
            newArray.splice(indexA2, 3, arrayNum1*arrayNum2);
            multiDivi(newArray); 
        } 
        else if (indexA == -1 || (indexB > 0 && indexB < indexA)) {
            indexB2 = indexB-1;
            arrayNum1 = parseFloat(newArray[indexB2]);
            arrayNum2 = parseFloat(newArray[indexB+1]);
            newArray.splice(indexB2, 3, arrayNum1/arrayNum2); 
            multiDivi(newArray);
        }
    }
    else {operations(newArray)};
} 
const addSub = (newArray) => {
    if (newArray.includes("+") || newArray.includes("-")) {
        indexA = newArray.indexOf("+");
        indexB = newArray.indexOf("-");
        console.log(newArray);
        if (indexB == -1 || (indexA > 0 && indexA < indexB)) {
            indexA2 = indexA-1;
            arrayNum1 = parseFloat(newArray[indexA2]);
            arrayNum2 = parseFloat(newArray[indexA+1]);
            newArray.splice(indexA2, 3, arrayNum1+arrayNum2);
            addSub(newArray); 
        } 
        else if (indexA == -1 || (indexB > 0 && indexB < indexA)) {
            indexB2 = indexB-1;
            arrayNum1 = parseFloat(newArray[indexB2]);
            arrayNum2 = parseFloat(newArray[indexB+1]);
            newArray.splice(indexB2, 3, arrayNum1-arrayNum2); 
            addSub(newArray);
        }
    }
    else {operations(newArray)};
}

// determines which operations to carry out, and displays answer if no remaining operations:
const operations = (newArray) => {
    
    if (newArray.includes(decodeURI("%C3%97")) || newArray.includes(decodeURI("%C3%B7"))) {
        multiDivi(newArray);} 

    else if (newArray.includes("+") || newArray.includes("-")) {
        addSub(newArray);}
    
    else { display.textContent = parseFloat(newArray[0].toFixed(9));
        if (display.textContent == "0") {
        display.classList.add("fadeOut"); 
          setTimeout(function() {display.style.fontSize = "60px"; //if result is zero; cleared with fadeout
          display.textContent = "";
          newArray = [];}, 2000)   
        }
        else if (display.textContent.length <= 6) {display.style.fontSize = "60px"}
        else if (display.textContent.length > 6 && display.textContent.length <= 10) 
        {display.style.fontSize = "40px"}
        else if (display.textContent.length > 10)  {display.style.fontSize = "20px"}
    }
}

//function for "enter": 
const enter = () => {
    if (entryText.textContent == "") {
        entry.textContent = "error, no entry"
    }
    else if (entryText.textContent == ".") {
        entry.textContent = "error, decimal without number"
    } 
    else if (newArray.length == 0 && !parseFloat(entryText.textContent)) {
        entry.textContent = "please begin with number"
    }
    else if ((parseFloat(entryText.textContent)) && parseFloat(newArray[newArray.length-1])) {
        entry.textContent = "error";
    }
    else if (!parseFloat(entryText.textContent) && !parseFloat(newArray[newArray.length-1])) {
        entry.textContent = "error, 2 operators or zero";
    }
    else {
    newArray.push(entryText.textContent); 
    display.textContent = display.textContent.concat(entryText.textContent);
        if (display.textContent.length > 6 && display.textContent.length <= 10) 
        {display.style.fontSize = "40px";}
        else if (display.textContent.length > 10)  {display.style.fontSize = "20px";}
    entry.textContent = ""; 
    entryText.nodeValue = "";   
    }
}

//when a calculator button is clicked, main function is fired:
document.addEventListener("mousedown", function(e) {

    if (e.target.className == "working") {
        display.classList.remove("fadeOut");
        displayCalc(e);
    } 
    
})

//main function that updates and displays numbers and operations, and executes the other calculating functions:
const displayCalc = (e) => {
    
    //if a number button is clicked, entry text is updated:
    const displayNum = (e) => {
         
        entryText.nodeValue = entryText.textContent.concat(e.target.textContent);  
        entry.textContent = entryText.nodeValue;
    } 

    //various functions of non-number buttons:
    const notNumber = (e) => {

        switch (e.target.id) {
        case "clear" :
            display.style.fontSize = "60px"
            display.textContent = "";
            entry.textContent = ""; 
            entryText.nodeValue = "";
            newArray = [];  
            break; 

        case "back" :
            entry.textContent = ""; 
            entryText.nodeValue = "";
            break;

        case "enter" :
            enter();
            break;

        case "add" :
            entry.textContent = "+";
            entryText.textContent = "+";
            break;

        case "subtract" : 
            entry.textContent = "-";
            entryText.textContent = "-";
            break;

        case "multiply" :
            entry.textContent = decodeURI("%C3%97");
            entryText.textContent = decodeURI("%C3%97"); 
            break;

        case "divide" :
            entry.textContent = decodeURI("%C3%B7");
            entryText.textContent = decodeURI("%C3%B7");
            break;

        case "equalsButton" :
            if (!parseFloat(newArray[newArray.length - 1])) {entry.textContent = "please end with number"}
            else {display.textContent = "";
            operations(newArray);
            }  
            break;
        } 
    }

    //determines if number button or non-number is clicked, as well as if zero or decimal clicked:
    parseInt(e.target.textContent) ? displayNum(e) : notNumber(e);  
    
    if (e.target.id == "zero") {
        
        entryText.nodeValue = entryText.textContent.concat(e.target.textContent);  
        entry.textContent = entryText.nodeValue;  
    }  
    
    if (e.target.id == "decimal") {
        
        let counter = 0;
        for (i=0; i<entry.textContent.length; i++) 
            { if (entry.textContent[i] == ".") {counter++;}   
            }
        if (counter > 0) {entry.textContent = "too many decimals"; entryText.nodeValue="";} 
        else { 
        entryText.nodeValue = entryText.textContent.concat(".");  
        entry.textContent = entryText.textContent;
        }  
    }    
}

//enables keyboard entry:
document.addEventListener("keydown", (e) => {

    const keyNum = (e) => {
        entryText.nodeValue = entryText.textContent.concat(e.key);  
        entry.textContent = entryText.nodeValue;
    }

    keyNotNum = (e) => {
        
        switch(e.key) {
            case "+" :
            entry.textContent = "+";
            entryText.textContent = "+";
            break;

            case "-" :
            entry.textContent = "-";
            entryText.textContent = "-";
            break;

            case "*" :
            entry.textContent = decodeURI("%C3%97");
            entryText.textContent = decodeURI("%C3%97");
            break; 

            case "/" :
            entry.textContent = decodeURI("%C3%B7");
            entryText.textContent = decodeURI("%C3%B7");
            break;

            case "=" :
            display.textContent = "";
            operations(newArray); 
            break;

            case "Enter" : 
            enter();
            break;

            case "Backspace" :
            entry.textContent = ""; 
            entryText.nodeValue = "";
            break;

            case "Delete" :
                display.style.fontSize = "60px"
                display.textContent = "";
                entry.textContent = ""; 
                entryText.nodeValue = "";
                newArray = [];  
            break;

            case "." :
            let counter = 0;
            for (i=0; i<entry.textContent.length; i++) 
                { if (entry.textContent[i] == ".") {counter++;}   
                }
            if (counter > 0) {entry.textContent = "too many decimals"; entryText.nodeValue="";} 
            else { 
            entryText.nodeValue = entryText.textContent.concat(".");  
            entry.textContent = entryText.textContent;
            }
            break;
        }
    }

    parseInt(e.key) ? keyNum(e) : keyNotNum(e) 
  
});  

// drag and drop calculator:   

calculator.addEventListener("dragstart", function(e) {
    
    let x1 = e.offsetX; 
    let y1 = e.offsetY;
    calculator.addEventListener("dragend", function(e) {
        let x = e.pageX; 
        let y = e.pageY;
        
        calculator.style.top = y-y1+"px";
        calculator.style.left = x-x1+"px"; 
        calc.style.top = y-y1-10+"px";
        calc.style.left = x-x1-10+"px"; 
    }) 
}) 