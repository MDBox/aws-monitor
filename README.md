# simple-node
A base starting point for node/express development  

## Common setup for prototyping solutions  
There are great generators out there, like yeoman that include nice development tools, but I find starting with a basic setup is exactly what I want to build simple prototypes or try out different libraries.  Feel free to use as you like.  


Included is a VagrantFile to help build a base environment.  This includes install NodeJS, express, and bower.  This is optional but it helps me.  Check out how to install vagrant here: https://www.vagrantup.com/docs/installation/  

```
vagrant up   #start vm
vagrant ssh  #connect to vm
cd /vagrant  #access shared folder between vm and host
node index.js #start node server

Server Running on ip http://192.168.33.11:45480
```
