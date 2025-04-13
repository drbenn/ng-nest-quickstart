## server redirect with SPA

If you try to access a path outside of the SPA you will get an error because the routing and display is determined by js.
to get around this with Angular, Namecheap and Apache(which namecheap uses). In the SPA directory with index.html create 
a .htaccess file (hypertext access) and add the following for rewrites.

<IfModule mod_rewrite.c>
  Options -MultiViews
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L,QSA]
</IfModule>

Now the server should be able to redirect to specific routes successfully.

## Why the front end does not use any cookie authentication or checks

  Front end user authentication is simple relying on the fact that auth state user id has been set.
  The reason there is no jwt cookie check is becuase the server provides http-only cookies so that
  the front end cannot access the cookie to prevent XSS(cross site scripting) attacks. The http-only
  jwt cookie is used by the server side guards which prevents any GET, POST, PATCH, PUT, DELETE, etc...
  requests without the client-side http-only jwt cookie being authenticated by the back-end. So although
  a hacker may be able to access ui routes by editing state somehow, they would not be able to view or
  modify the actual data on the routes because they would not have an adequate jwt token to be authenticated
  on the server.