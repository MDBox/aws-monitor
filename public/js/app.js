var awstracker = angular.module('awstracker', ['ngRoute', 'awsService']);

awstracker.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/',{
    templateUrl: '/html/tracker',
    controller: 'AwsController as awsController'
  }).when('/:keyid/:cred', {
    templateUrl: '/html/tracker',
    controller: 'AwsController as awsController'
  });
  $locationProvider.html5Mode(true);
});

awstracker.factory('data', function ($rootScope) {
  this.volumes = [];
  this.storage = 0;
  this.cost = 0;
  return this;
});

awstracker.controller('AwsController', ['$scope',
'$route','$routeParams','$location', 'data',
  function($scope, $route, $routeParams, $location, shareddata){
    $scope.shareddata = shareddata;
    $scope.$watchCollection('shareddata.volumes', function(){ //Watch for new volumes and adjust total storage
      var size = 0;
      shareddata.volumes.map(function(volume){
          console.log(volume.Size);
          size += volume.Size;
      })
      shareddata.storage = size;
      shareddata.cost = size * 0.12;
    })
    $scope.regions = {
      virginia: 'us-east-1',
      california: 'us-west-1',
      oregon: 'us-west-2',
      mumbai: 'ap-south-1',
      tokyo: 'ap-northeast-1',
      seoul: 'ap-northeast-2',
      singapore: 'ap-southeast-1',
      sydney: 'ap-southeast-2',
      frankfurt: 'eu-central-1',
      ireland: 'eu-west-1',
      paulo: 'sa-east-1'
    }
}]);

awstracker.controller('RegionController', ['$scope', 'aws', 'data',
  function($scope, aws, shareddata){
    $scope.volumes = [];
    $scope.total_storage = 0;
    $scope.total_cost = 0;

    $scope.$watchCollection('volumes', function(){ //Watch for new volumes and adjust total storage
      var size = 0;
      console.log('update volumes');
      $scope.volumes.map(function(volume){
          console.log(volume.Size);
          size += volume.Size;
      })
      $scope.total_storage = size;
      $scope.total_cost = size * 0.12;
    })

    $scope.init = function(region_name){
      $scope.aws = aws.make(region_name);
      // var aws2 = aws.make('ap-northeast-2');
      // var aws3 = aws.make('us-east-1');
      $scope.aws.findStoppedInstances().then(function(data){
        if(data.NextToken){
          console.log('there are more stopped instances');
        }
        console.log(data)
        $scope.reservations = data.Reservations;
        $scope.$apply();
      }).catch(function(err){
        console.log(err);
      });

      $scope.aws.findAvailableVolumes().then(function(data){
        if(data.NextToken){
          console.log('there are more available volumes');
        }
        console.log(data);
        $scope.volumes.push.apply($scope.volumes, data.Volumes);
        shareddata.volumes.push.apply(shareddata.volumes, data.Volumes);
        $scope.$apply();
      }).catch(function(err){
        console.log(err);
      });
    }
}]);

awstracker.controller('VolumeController', ['$scope', 'data',
  function($scope, shareddata){
    $scope.volumedata = null;
    $scope.init = function(volume){
      $scope.aws.findVolume(volume).then(function(data){
        if(data.Volumes.length > 0){
          console.log(data);
          $scope.volumedata = data.Volumes[0];
          $scope.volumes.push(data.Volumes[0]);
          shareddata.volumes.push(data.Volumes[0]);
        }
        $scope.$apply();
      }).catch(function(err){
        console.log(err);
      });
    }
}]);
