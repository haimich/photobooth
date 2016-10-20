# photobooth

![screenshot](https://raw.githubusercontent.com/haimich/photobooth/master/concept/screenshot.png)

## Prerequisites
Add a config file named photobooth-config.yml to the top level of the project. Format:

```
flickr:
  url: 
  api_key: 

one:
  host: 
  shoutout_wall: 
  api_path_share: 
  api_path_upload: 
  user:
  pw: 
```

Add a folder "photos" to the top level.

## How to start
```bash
sudo npm install -g static-server
static-server static
```

## Flickr API
* https://www.flickr.com/services/api/misc.urls.html
 
# Todos
* make faster (eg. usin http://seriouslyjs.com/)
