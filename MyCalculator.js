//global variables:
const calculator = document.querySelector("#calculator-border-wrap");
const display = document.querySelector("#display");
const entry = document.querySelector("#entry");
let entryText = document.createTextNode("");
let newArray = [];
let indexA = 0;
let indexA2 = 0;
let indexB = 0;
let indexB2 = 0;
let arrayNum1 = 0; 
let arrayNum2 = 0;
let x = 0;
let x1 = 0;
let y = 0;
let y1 = 0;

let fade; 
const stopper = () => {clearTimeout(fade)};


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

// determines which operations to carry out in mathematically correct order (ie BEDMAS), 
//and displays answer if no remaining operations:
const operations = (newArray) => {
    
    if (newArray.includes(decodeURI("%C3%97")) || newArray.includes(decodeURI("%C3%B7"))) {
        multiDivi(newArray);} 

    else if (newArray.includes("+") || newArray.includes("-")) {
        addSub(newArray);}
    
    else { display.textContent = parseFloat(newArray[0].toFixed(9));

        //if result is zero; screen cleared with 2sec fadeout for visual appeal:
        if (display.textContent == "0") {
            display.classList.add("fadeOut");
            fade = setTimeout(function() {display.textContent= "";}, 2000);
            }   
        else if (display.textContent.length <= 6) {display.style.fontSize = "60px"}
        else if (display.textContent.length > 6 && display.textContent.length <= 10) 
        {display.style.fontSize = "40px"}
        else if (display.textContent.length > 10)  {display.style.fontSize = "20px"}
    }
}

//function for "enter": 
const enter = () => {
    if (entryText.textContent == "" || entryText.textContent == ".") {
        entry.textContent = "error, no entry"
    }
    else if (newArray.length == 0 && !parseFloat(entryText.textContent)) {
        entry.textContent = "need number to start"
    }
    else if ((parseFloat(entryText.textContent)) && parseFloat(newArray[newArray.length-1])) {
        entry.textContent = "error";
    }
    else if (!parseFloat(entryText.textContent) && !parseFloat(newArray[newArray.length-1])) {
        entry.textContent = "error or zero";
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
        //clears if answer is "0":
        if (display.textContent == "0" || newArray[0] == 0) {display.textContent = ""; newArray = [];}
        display.classList.remove("fadeOut");
        stopper(); //stops the 2 sec fadeout if it's still happening. 
        displayCalc(e);
    } 
    
});

//main function that updates and displays numbers and operands, and executes the other calculating functions:
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
            display.textContent = "";
            operations(newArray); 
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

// Can drag and drop calculator on screen if screen larger than tablet size:  
const dragStart = (e) => {
    x1 = e.offsetX;
    y1 = e.offsetY;
}       
            
const dragEnd = (e) => {       
        x = e.pageX;
        y = e.pageY;
        calculator.style.top = y-y1+"px";
        calculator.style.left = x-x1+"px";
}
calculator.addEventListener("dragstart", dragStart);
calculator.addEventListener("dragend", dragEnd);

//removes h3 element and reduces h1 font size if window size is narrowed:
window.addEventListener('resize', function(e) {
    calculator.addEventListener("dragstart", dragStart);
    calculator.addEventListener("dragend", dragEnd);
    
     if (window.innerWidth < 1200 && window.innerWidth > 600) {         
        document.querySelector("h3").style.display = "none";
        document.querySelector("h1").style.fontSize = "2em";
    }
    else if (window.innerWidth < 600) {
        calculator.removeEventListener("dragstart", dragStart);
        calculator.removeEventListener("dragend", dragEnd);
        calculator.style.left = 0;
        calculator.style.top = 0;
    }
    else {
        document.querySelector("h3").style.display = "";
        document.querySelector("h1").style.fontSize = "3em";
    }

});