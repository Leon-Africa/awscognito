# AwsCognito
Exploring various authetication perspectives with AWS Cognito

 The documentation on how to setup browser script, securely, is pretty all over the place. Especially with Cognito, I have not found a concise to the point explanation. This is an attempt to such a summary with code. Using Angular JS, in Brower Script Cognito, then Lambda doing authentication via userpool associted lambda triggers, after this you can pretty much hook up to any other service via your lambdas for the specific users in your pool.

# Briefing:

For the browser setup you require two pools, the userpool for your users and then an identity pool. The userpool is added as an Authentication provider for the identity pool. In your browser code goes the userpool logic to signup a user. After the user is signed up, we call lambda that does authentication to the identity pool. The credentials to authenticate that user come from the Cognito Identiy Pool. (This is how its done)

In know you thinking....
WHY would you want to do that?!

Answer: Cognito was generally released as only federated identites hence user credentials were obtained from a third party providing authenticity. Therefore Authentication providers are an integral part of Cognito, you either go Authenticated or Unauthenticed. (And Unauthenticed is technically just temporary authentication anyway...) So if you want to use a userpool and harness the benefits offered by Cognito Identity pool what you have to do is have your user pool as the authentication provider. An this authentication you can handle yourself. In this way you harness the benefits of both userpools and Cognito Identity pools. So to summarize, think of it like instead of facebook being your authentication provider, for example, your userpool now does that.

IMPORTANT TO NOTE:<br>
Userpools by default have no IAM roles associted via console hence you cannot manipulate your users access to your aws resources swifty via console as with Identity pools. Although from what I can deduce, this may be a possiblity, if you authenticated your users with only userpools. Addtionally then to give access to services, I would say a possible work around is the user sub. You will see that each user in a userppool has an associted sub, a possiblity can exit to use this sub as a variable in your IAM role. (The sub is the UUID of the authenticated user) This is simialr to what is done with users Identity IDs in a Cognito Identity Pool when you want to limit respective users privelages to resources.

More info: https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-authentication-part-3-roles-and-policies/

I still have to test that for userpools...

With that said: User pool as authentication provider with Identiy pool is a MUCH swifter option!

To mention a few benefits:
Easily configure and manage access for users to AWS resources.
You know all your user data.
You can have various lambda triggers for that data, or any logic pertaining to your signup process for your userpool.
Meaning serious custom auth flow challeneges, for example, CAPCHAS or even biometric.
In other words, you become a COGNITO CUSTOMIZATION KING. 

 <img src="awscognito/img/king.gif" alt="" style="margin: auto; padding: 10px;"/>

Demonstration:  



