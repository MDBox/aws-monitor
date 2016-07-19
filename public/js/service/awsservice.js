var awsService = angular.module('awsService', []);

/*
  Simple factory wrapper around AWS-SDK library
*/
awsService.factory('aws', function () {
  return {
    make: function(region_name, keyid, cred){
      var ec2 = new AWS.EC2({
        accessKeyId: keyid,
        secretAccessKey: cred,
        region: region_name,
        maxRetries: 5,
        retryDelayOptions:{
          base:5000
        }
      })

      return {
        findVolume: function(volumeid){
          return new Promise(function(resolve, reject){
            ec2.describeVolumes({
              Filters: [{
                Name: 'volume-id',
                Values: [volumeid]
              }]
            }, function(err, data){
              if(err){
                reject(err);
              }else{
                resolve(data);
              }
            })
          })
      },
      findAvailableVolumes: function(nexttoken){
        return new Promise(function(resolve, reject){
          ec2.describeVolumes({
            Filters: [{
              Name: 'status',
              Values: ['available']
            }],
            NextToken: nexttoken
          }, function(err, data){
            if(err){
              reject(err);
            }else{
              resolve(data);
            }
          })
        })
      },
      findStoppedInstances: function(nexttoken){
        return new Promise(function(resolve, reject){
          ec2.describeInstances({
            Filters: [{
              Name: 'instance-state-name',
              Values: ['stopped']
            }],
            NextToken: nexttoken
          }, function(err, data){
            if(err){
              reject(err);
            }else{
              resolve(data);
            }
          })
        })
      }
    }
    }
  }
});
