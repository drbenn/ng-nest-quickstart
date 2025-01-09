# ng nest quickstart project

## something about something ~YOLO~


I have an angular front end and a nestjs backend with typeorm.

I want to create an auth/login system where the user can register/login with either a standard email and password or they can sign in with nest passport and oauth, oauth would be able to login with either google, facebook or github as the provider. OAuth will be implemented mainly on the backed with only redirects being sent to the front end upon successful auth and user information pull from my database users table.

I would like to support both methods of login with one user type orm entity. This makes me believe that although Oauth logins will not have a password, the standard login will require one, thus a password will be required in the user object as optional. I would like to store the password as hashed and salted, and for users who login with the standard email and password they will have their typed password hashed and salted and compared with the stored password that has been hashed and salted.

The Oauth user logins will not require a password and upon will retrieve the user information from the users table by pulling the appropriate record by email.

I would like my angular application to hold a jwt cookie with an expiration of 48 hours for accessing api guarded routes. Upon successful login via standard email & password or Oauth, my server will return this jwt (created by nestjs jwtmodule)

What do you think? Lets get rollin baby!