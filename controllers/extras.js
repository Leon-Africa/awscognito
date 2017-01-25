// THIS CODE IS IF YOU WANT TO AUTHENTICATE IN BROWSER 
// YOU HAVE TO CAPTURE CREDENTIALS VIA COGNITO IDENTITY

/*
Get Credentials from the identity pool
IMPORTANT NOTE:    The aws SDK contains CognitoIdentityCredentials whereas the aws Cognito sdk contains CognitoIdentityServiceProvider.
					When it come to accessing these scripts remeber for aws CognitoIdentiy, we will say AWS.CognitoIdentityCredentials
					Whereas in the method configureUserpool(), where we make use on aws CognitoIdentity SDK, access to script is AWSCognito.CognitoIdentityServiceProvider
*/
$scope.getAwsCredentials = function(){

  

   
  


  /*
    Using aws sdk CognitoIdentityCredentials 
    Populate IdentityPoolId and pass the ID token through the Logins map.
  */
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    Logins: {
        'cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX': 
 result.getIdToken().getJwtToken()
    }
});
 
AWS.config.credentials.get(function(err){
    if (err) {
        alert(err);
    }
});

}




//THIS IS INSTRUCTION IF YOU WANT TO IMPLEMENT MFA

/*
	If you want to implemet MFA you will need to capture it from frontend then handle in browser to assure correct signup credentials via the verification code
 */
//capture email
var email = $scope.obj.email;
$scope.email = email;

//have variable var usermail;

//configureUserpool has email param . 
configureUserpool = function(username, useremail, userpassword)

//Set it as an attribute
var dataEmail = {
       Name : 'email',
       Value : usermail
};

// Instatiate it in service provider
 var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

// and then implement authentication checks in code
cognitoUser.confirmRegistration('123456', function(err, result) {
                if (err) {
                     alert(err);
                     return;
                }
                alert(result);
            });

// CHECK OUT EXAMPLES ON PUBLIC DOCS: http://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html

