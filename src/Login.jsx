import { useState } from 'react'

export default function Login({

onLogin

}){

const [

user,

setUser

]=useState('')

const [

password,

setPassword

]=useState('')

function login(){

const expiration =

new Date(

'2026-07-10'

)

if(

new Date()

>

expiration

){

alert(

'Trial expired'

)

return

}

if(

user==='Alumno2'

&&

password==='airweight20'

){

onLogin()

}

else{

alert(

'Invalid credentials'

)

}

}

return(

<div

style={{

height:'100vh',

display:'flex',

flexDirection:'column',

justifyContent:'center',

alignItems:'center',

gap:'15px',

background:'#111827',

color:'white'

}}

>

<h1>

AIRWEIGHT

</h1>

<input

placeholder='User'

value={user}

onChange={

e=>

setUser(

e.target.value

)

}

/>

<input

type='password'

placeholder='Password'

value={password}

onChange={

e=>

setPassword(

e.target.value

)

}

/>

<button

onClick={login}

>

ACCESS

</button>

</div>

)

}