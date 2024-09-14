#pragma strict

var Speed        : float = 0;//Don't touch this
var MaxSpeed     : float = 10;//This is the maximum speed that the object will achieve
var Acceleration : float = 10;//How fast will object reach a maximum speed
var Deceleration : float = 10;//How fast will object reach a speed of 0

function Update () {
if ((Input.GetKey ("left"))&&(Speed < MaxSpeed))
    Speed = Speed - Acceleration * Time.deltaTime;  
else if ((Input.GetKey ("right"))&&(Speed > -MaxSpeed))
    Speed = Speed + Acceleration * Time.deltaTime;
else
{
    if(Speed > Deceleration * Time.deltaTime)
        Speed = Speed - Deceleration * Time.deltaTime;
    else if(Speed < -Deceleration * Time.deltaTime)
        Speed = Speed + Deceleration * Time.deltaTime;
    else
        Speed = 0;
}

transform.position.x = transform.position.x + Speed * Time.deltaTime;
}