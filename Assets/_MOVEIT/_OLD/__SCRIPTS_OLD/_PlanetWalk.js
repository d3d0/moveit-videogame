#pragma strict


 var orbitRef : Transform;
    var push : float = 10;
    var attractForce : float = 5;
    var distanceMini : float = 2;

    function FixedUpdate () {
    // Planetary gravity
    var direction = orbitRef.position - transform.position;
    direction.Normalize();
    rigidbody.AddForce (direction * attractForce);

    // Floating above the surface
    var dir = transform.TransformDirection (-Vector3.up);
    var finRaycast = transform.localPosition;
    finRaycast.y = transform.localPosition.y-distanceMini;
    Debug.DrawLine (transform.position, finRaycast, Color.red);
        if (Physics.Raycast (transform.position, dir, distanceMini)) {
            rigidbody.AddForce (0, push, 0);
        }
    } 