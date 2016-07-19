### AWS Volume Tracker Tool  
This project uses the aws-sdk browser plugin to find aws volumes that are either not attached or attached but to stopped instances.
The idea is to help lower cost by either removing unused volumes or taking a snap-shot to be used later.  

## Node/express server  
```
  //Start Server
  node index.js
  
  //listens on port 45480 http://127.0.0.1:45480
```

## API  
AWS-SDK is run locally from the browser and no key information is sent to the node server.  Since this is a prototype only key-pair login is supported.
The key-pair needs AmazonEC2ReadOnlyAccess but as long as the user has permission to read instance and volume state, it should work.  
  
  
## Screenshots  
<img src="https://cloud.githubusercontent.com/assets/3600625/16939295/3502b50e-4dbb-11e6-936b-81d622906b2a.png"></img>
<img src="https://cloud.githubusercontent.com/assets/3600625/16939282/18c2b47a-4dbb-11e6-9989-88866dc1f907.png"></img>
