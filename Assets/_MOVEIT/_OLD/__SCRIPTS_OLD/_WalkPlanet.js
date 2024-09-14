var ScurrySpeed = 30;

 

private var testChange = -1; //during production the mobs should run away from the camera, but during development I want to see

                                //them all run at the camera hence the -1 modifier during testing

private var DistanceX : float;

private var DistanceY : float;

private var DistanceZ : float;

private var gravityForce = -10;

private var ParentVector : Vector3;

    ParentVector = transform.parent.position;

 

function FixedUpdate(){

//check location of spheres and keep them close to the world

    var gravityDirection : Vector3;

    gravityDirection.x = (transform.position.x - ParentVector.x);

    gravityDirection.y = (transform.position.y - ParentVector.y);

    gravityDirection.z = (transform.position.z - ParentVector.z);

    rigidbody.AddForce(gravityDirection * gravityForce);

}

 

 

function Update () {

 

var GoalX = GameObject.Find("DarkSide").transform.position.x;

var GoalY = GameObject.Find("DarkSide").transform.position.y;

var GoalZ = GameObject.Find("DarkSide").transform.position.z;

 

DistanceX = Mathf.Abs(GoalX - transform.position.x);

DistanceY = Mathf.Abs(GoalY - transform.position.y);

DistanceZ = Mathf.Abs(GoalZ - transform.position.z);

 

 

if((transform.position.x < 10 && transform.position.x > -10) && 

    (transform.position.y < 10 && transform.position.y > -10) && 

        transform.position.z < (testChange * 100))

    {

    Debug.Log(transform.name + " is here.");

    transform.renderer.material.color = Color.green;

    // do nothing we are at the right location

    }

else

    {

    if (transform.name == "Sphere2")

    {

        Debug.Log("S2 X: " + transform.position.x + " Y: " + transform.position.y + " Z: " + transform.position.z);

        Debug.Log("Target X: " + GoalX + " Y: " + GoalY + " Z: " + GoalZ);

        

    }

    transform.renderer.material.color = Color.red;

    MoveSphere();

    }

}

 

function MoveSphere () {

 

if (transform.position.x == 0 && transform.position.y == 0 && transform.position.z < 0) //assume we are at 0,0,-100

    {

    transform.RotateAround(Vector3.zero, Vector3.up, ScurrySpeed * Time.deltaTime);

    }

else if (transform.position.y < 0) //we are in the southern hemisphere

    {

    if(transform.position.x < 0) // we are on the left

        {

        transform.RotateAround(Vector3.zero, Vector3(testChange * -1,testChange * 1,testChange * 0), ScurrySpeed * Time.deltaTime);

        }

    else // we are on the right

        {

        transform.RotateAround(Vector3.zero, Vector3(testChange * -1,testChange * -1,testChange * 0), ScurrySpeed * Time.deltaTime);

        }

    }

else // we are in the northern hemisphere

    {

    if(transform.position.x < 0) // we are on the left

        {

        transform.RotateAround(Vector3.zero, Vector3(testChange * 1,testChange * 1,testChange * 0), ScurrySpeed * Time.deltaTime);

        }

    else // we are on the right

        {

        transform.RotateAround(Vector3.zero, Vector3(testChange * 1,testChange * -1,testChange * 0), ScurrySpeed * Time.deltaTime);

        }

    }

 

}