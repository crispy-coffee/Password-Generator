const inputSlider = document.querySelector("[data-lengthSlider]");
const lenghtDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*(){}["]_-=+/.,;?>"<';


let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handleSlider();

// set Password Length
function handleSlider(){
    inputSlider.value = passwordLength;
    lenghtDisplay.innerText = passwordLength;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =  ((passwordLength/max) * 100) + "% 100%";
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;   
}

function generateRandomNumber(min, max){
    return getRndInteger(0, 10);
}


function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

function  generateSymbols(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false, hasLower = false, hasNum = false, hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
        setIndicator("#0f0");
    else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6)
        setIndicator("#ff0");
    else    
        setIndicator("#f00");
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }catch(e){
        copyMsg.innerHTML = "failed";
        console.log(e);
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // For shuffle there is algo called "Fisher yates Method" which only applies on Array, this is why we received the password as array

    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // Special Corner Case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});


// Slider Movement
inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        handleSlider();
});

// Copy Content
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click', () => {
    // none of the check box is selected
    if(checkCount <= 0) return;
    
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's start the journey to find the new password

    // remove old password
    password = "";  

    // insert the checked conditions first
    /*
    if(uppercaseCheck.checked)
        password += generateUpperCase();
    
    if(lowercaseCheck.checked)
        password += generateLowerCase();
    
    if(numberCheck.checked)
        password += generateRandomNumber();
    
    if(symbolsCheck.checked)
        password += generateSymbols();
     */

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    var remaining = passwordLength-funcArr.length;
    for(let i=0; i<remaining; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
     
    // Shuffle the Password
    // password = shufflePassword(Array.from(password));

    // show the Password
    passwordDisplay.value = password;

    // Calculate the Strength
    calcStrength();

});


