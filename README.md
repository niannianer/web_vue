``` js
 location ~* ^.+land.+\.(html)$ {  
			root  /ZJ/h5-landing-page/html;
			add_header Cache-Control 'no-store';
            allow all; 
		} 
		
	location ~* ^.+land.+\.(css|js|txt|xml|swf|wav|png|jpg|json|woff|ttf)$ {  
			root  /ZJ/h5-landing-page;
			access_log   off;  
			expires      30d;  
			} 
```
