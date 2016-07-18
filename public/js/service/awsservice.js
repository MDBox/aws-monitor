var awsService = angular.module('awsService', []);


awsService.factory('aws', function ($rootScope) {
  return {
    make: function(region_name, keyid, cred){
      var region = region_name;
      var ec2 = new AWS.EC2({
        accessKeyId: 'AKIAIZXQOFFTAR65XS4Q',//'AKIAIMTLMCWJ3DS6JMKA',
        secretAccessKey: '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', //'684+pxnSi3QAooNPgZlpLrTQowBuyVtmmYv8R5Df',
        region: region_name,
        maxRetries: 5,
        retryDelayOptions:{
          base:5000
        }
      })

      return {
        findVolume: function(volumeid){
          console.log(region);
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
