const passToggle = document.getElementById("pass-tog")
const password = document.getElementById("password")
const conPass = document.getElementById("confirm")
const firstname = document.getElementById("first")
const mobile = document.getElementById("dial")
const lastname = document.getElementById("surname")
const email = document.getElementById("email")
const sub = document.getElementById("btn-sub")
const firstError = document.getElementById("firstError")
const firstValid = document.getElementById("firstValid")
const lastError = document.getElementById("lastError")
const lastValid = document.getElementById("lastValid")
const numError = document.getElementById("numError")
const numValid = document.getElementById("numValid")
const emailError = document.getElementById("emailError")
const emailValid = document.getElementById("emailValid")
const passError = document.getElementById("passError")
const passValid = document.getElementById("passValid")
const conpassError = document.getElementById("conPassError")
const conpassValid = document.getElementById("conPassValid")
const dropDown = document.getElementById("drop-down")
let errMsg = ""
const countryCode = ["+234","+233"]
const form = document.getElementById("parent")
// const div = document.getElementById("div")
// fetch("http://localhost:5000/open/user", {
//     method: "POST",
//     headers: {
//         "Content-Type": "Application/json"
//     },
//     body: JSON.stringify({
//         "id": "1",
//         "gender": "male",
//         "name": "Emeka"
//     })
// }
// )
countryCode.forEach((element, index) => {
    dropDown.innerHTML+=`<option id=${index}>${element}<option/>`
});

passToggle.addEventListener("click", function(e){
    if(password.getAttribute("type")=="password"){
        password.setAttribute("type","text")
    } else{
        password.setAttribute("type","password")
    } 
})
const searchValue = document.getElementById("search")
const serBtn = document.getElementById("sr")
serBtn.addEventListener("click",function(e){
    e.preventDefault()
    search()
})
function search(){
    console.log("Searching")
    fetch(`http://localhost:5000/user/${searchValue.value}`) //("http://localhost:8080/category/users")
    .then((res)=>{
                console.log(res.status)
                if(res.status!=200){
                    alert("Request failed")
                    return
                }
                res.json().then(data=>console.log(data))
                // window.location.href="/login.html"
    })
    .catch((e)=>{
        console.log("failed")
    })
}

sub.addEventListener("click",function(e){
    e.preventDefault()

    console.log(validateName(firstname,firstValid,firstError))

    console.log(validateName(lastname,lastValid,lastError))

    console.log(validateNumber(mobile,numValid,numError))

    console.log(validateEmail(email,emailValid,emailError))

    console.log(passwordEqualsConfirm(password,conPass,conpassValid,conpassError))

    // console.log(validatePassword(password,passValid,passError))

    // console.log(validatePassword(conPass,conpassValid,conpassError))

    if(
        // validateName(firstname,firstValid,firstError) 
        // && validateName(lastname,lastValid,lastError)
        // && validateNumber(mobile,numValid,numError)
        // && validateEmail(email,emailValid,emailError)
        // && validatePassword(password,passValid,passError)
        // && validatePassword(conPass,conpassValid,conpassError)
        // && passwordEqualsConfirm(password,conPass,conpassValid,conpassError)
        true
    ){
            fetch("http:localhost:5000/user/1") //("http://localhost:8080/category/users")
            .then((res)=>{
                console.log(res.status)
                if(res.status!=200){
                    alert("Request failed")
                    return
                }
                res.json().then(data=>console.log(data))
                // window.location.href="/login.html"
            })
            .catch((e)=>{
                console.log("failed")
            })
    }

    // form.submit()

})

function validateName(element,valid,error){
    try {
        let name = element.value
        // console.log(asass)
        if(name.match(/^[a-z]{3,30}$/) ){
            valid.style.display="block"
            error.style.display="none"
            return true
        } else{
            error.style.display="block"
            valid.style.display="none"
            return false
        }
    } catch (error) {
        console.log(error)
    }
   
}

function validatePassword(element,valid,error){
    let pass = element.value
    console.log(pass.match(/[a-z]/))
    if(!(pass.length>7)){
        error.style.display="block"
        valid.style.display="none"
        msg="Password must be more than 7 characters"
        console.log(msg)
        error.innerHTML=msg
        return false
    } 

    if(!pass.match(/[a-z]/)){
        error.style.display="block"
        valid.style.display="none"
        msg="Must contain one lowercase Character"
        console.log(msg)
        error.innerHTML=msg
        return false
    }

    if(!pass.match(/[A-Z]/)){
        error.style.display="block"
        valid.style.display="none"
        msg="Must contain one uppercase Character"
        console.log(msg)
        error.innerHTML=msg
        return false
    }

    if(!pass.match(/[0-9]/)){
        error.style.display="block"
        valid.style.display="none"
        msg="Must contain one Number"
        console.log(msg)
        error.innerHTML=msg
        return false
    }

    if(!pass.match(/[ -\/:-@]/)){
        error.style.display="block"
        valid.style.display="none"
        msg="Must contain one Special charac"
        console.log(msg)
        error.innerHTML=msg
        return false
    }

    // msg ? alert("content") : alert("empty")

    if(!pass.match(/^\S/)){
        error.style.display="block"
        valid.style.display="none"
        msg="Must not start with white space"
        console.log(msg)
        error.innerHTML=msg
        return false
    }

    valid.style.display="block"
    error.style.display="none"
    return true

}

function validateNumber(mobile,valid,error){
    const tel = mobile.value
    if(!tel.match(/^[7-9][0-1][0-9]{8}$/) || !countryCode.includes(dropDown.value)){
        error.style.display="flex"
        valid.style.display="none"
        msg="Invalid number"
        console.log(msg)
        error.innerHTML=msg
        return false
    }

    error.style.display="none"
    valid.style.display="flex"
    return true

}


function validateEmail(email,valid,error){
    const em = email.value
    if(!em.match(/^[a-zA-Z0-9]{3,30}@[a-z]{5,15}\.[a-z]{2,10}$/)){
        error.style.display="flex"
        valid.style.display="none"
        msg="Invalid Email"
        error.innerHTML=msg
        return false
    }

    error.style.display="none"
    valid.style.display="flex"
    return true
}

function passwordEqualsConfirm(password,confirm,valid,error){
    const pass = password.value
    const con = confirm.value
    console.log(pass,con)
    if(!pass==con){
        error.style.display="flex"
        valid.style.display="none"
        msg="password do not match"
        error.innerHTML=msg
        console.log(msg)
        return false
    }

    error.style.display="none"
    valid.style.display="flex"
    return true
}

// comment1 = {
//     email: "user 1",
//     comment: "asjgahsgkasasajsnbd"
// }
// comment2 = {
//     email: "user 2",
//     comment: "asjgahsgkasasajsnbd"
// }
// comment3 = {
//     email: "user 3",
//     comment: "asjgahsgkasasajsnbd"
// }

// const arr = [comment1,comment2,comment3]

// arr.forEach(function(data){
//     div.innerHTML+=`<div>
//     <p>user: ${data.email}</p>
//     <p>comment: ${data.comment}</p>
//     </div>`
//     console.log("user", data.email)
//     console.log("comment", data.comment)
// })

