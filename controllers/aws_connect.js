angular.module('aws_app', ['ui.bootstrap'])
.controller('AwsConnect', ['$scope', function($scope){
  
  
/*
  Get user information and begin process...
 */
  $scope.register = function() {
    if ($scope.form.$valid) {
      
      //send to apigateway
      // The user details
      var name = $scope.obj.name;   //username regex=[\p{L}\p{M}\p{S}\p{N}\p{P}]+ 
      var password = $scope.obj.password;

      //Check that the password is numbers only
      if(isNaN(password)){

     // alert("Password MUST contain numbers only. \n Please renter password to continue."); 
      swal("Password MUST contain numbers only!", "Please renter password to continue.", "warning");

      }else if(/([\p{L}\p{M}\p{S}\p{N}\p{P}]+)/.test(name)){ //Ensure correct regex

       // alert("Username may not contain spaces. \n Please renter username to continue.");

        swal("Username may not contain spaces / CAPS!", "Please renter username to continue!", "warning");
      }
      else{ //username and password ok
       
        
        $scope.name = name;
        $scope.password = password;

        //Signup user
        $scope.configureUserpool($scope.name, $scope.password); 
      }
      
    }
  }


 /*
  Configures the userpool and signup
  Using aws Cognito sdk CognitoIdentityServiceProvider
 */
  $scope.configureUserpool = function(username, userpassword){

      var username;
      var userpassword;


      /*
        To authenticate with Amazon Cognito Identity, the client app needs to generate a random number as
        part of the Secure Remote Password (SRP) protocol
        More info: http://srp.stanford.edu/
      */
   
    
      /*
            Set up pool data 
       */
      var poolData = {
          UserPoolId : 'us-east-1_o6L5mDxNM',
          ClientId : '4qknomcsktofcdooltc4f47gti',  //DON"T GENERATE SECRET KEY FOR BROWSER JS
          Paranoia : 7   //Security concerns due to random number genearation using sjcl, may call sjcl.ransdom.startCollectors()  More Info: https://github.com/bitwiseshiftleft/sjcl/issues/77
        };

        
      
      //Instantiate the service for userpool
      var userPool = new
        AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    
      //Set Paranoia via object method
      userPool.setParanoia(7);
    
    
      var attributeList = [];
    
      //Get data ready to sign up a user
      var dataName = {
        Name : 'name',
        Value : username
       };

    


   
    //Instatiate userdata in service provider
    var attributeName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName);
   
    //signup method for userpool expects a string
    $scope.userpassword = JSON.stringify(userpassword).replace('"','').replace('"','');

    //Stringyfy causes username to be of form "username" in Cognito, therefore replace '""' so that username may appear of satisfactory form: username
    $scope.username = JSON.stringify(username).replace('"','').replace('"','');

    
    //Push to Cognito
    attributeList.push(attributeName);
    
    
    

    /*
        Signup user
        @params username, password are strings
        Info: http://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html
     */
    userPool.signUp($scope.username, $scope.userpassword, attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;

        $scope.info = JSON.stringify(cognitoUser);
        
        //Response Object
       // alert("RESPONSE\n\n\n " + JSON.stringify(cognitoUser));
       // 
       // 
       alert("Result for user signup promise: \n\n\n\n" + $scope.info + "\n\n\n\n");

        $scope.currentusername = cognitoUser.getUsername() + "!";

        swal($scope.currentusername  , "You have just signed up! You may now log in with your name and password on the right!", "success");
        
    });



  }

  // TRIGGERS: https://aws.amazon.com/blogs/mobile/customizing-your-user-pool-authentication-flow/
  // 
  // 
  // 
  

  //Get the login Credentials to log user in
  $scope.login = function(){

    //get data 
    var login_name = $scope.obj.login_name;
    var login_password = $scope.obj.login_password;

    //store in scope
    $scope.login_name = login_name;
    $scope.login_password = login_password;

    //Authenticate the user
    $scope.authenticateUser($scope.login_name, $scope.login_password);



  }
  
  $scope.authenticateUser = function(login_name, login_password){

    //Authenticate User into the userpool
    var authenticationData = {
        Username : login_name,
        Password : login_password,
    };

    //alert(login_password);
   // alert(login_name);

    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    //The User pool Data
    var poolData = { UserPoolId : 'us-east-1_o6L5mDxNM',
        ClientId : '4qknomcsktofcdooltc4f47gti'
    };

    //Instantiate the userpool
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    //Establish the userdata
    //
    var userData = {
        Username : login_name,
        Pool : userPool
    };

    //Instantiate the provider with the user data
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    //Authenticate the user 
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
           
            /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
 
            $scope.tokens = " Great! here are your tokens to trade with Cognito Identity so you can get temporary access to AWS(Temp AWS keys are obtained from AWS STS):\n\n\n\n\n" + "access_token:" + result.getAccessToken().getJwtToken() + "\n\n\n\n\n\nidToken: " + result.idToken.jwtToken;

            alert($scope.tokens);

          

          
        },

        onFailure: function(err) {
            alert(err);
        },

    });
  }


  

}]);








