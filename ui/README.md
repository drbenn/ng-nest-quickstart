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