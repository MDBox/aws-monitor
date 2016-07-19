var awstracker = angular.module('awstracker', ['ngRoute', 'awsService']);

awstracker.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/',{
    templateUrl: '/html/tracker/login.html',
    controller: 'LoginController as loginController'
  }).when('/tracker', {
    templateUrl: '/html/tracker',
    controller: 'AwsController as awsController'
  });
  $locationProvider.html5Mode(true);
});

awstracker.factory('data', function () {
  this.volumes = [];
  this.storage = 0;
  this.cost = 0;
  this.keyid = '';
  this.secret = '';
  return this;
});

awstracker.controller('LoginController', ['$scope', '$location', 'data',
  function($scope, $location, appdata){
    $scope.appdata = appdata;
    $scope.submit = function(){
      if(appdata.keyid.length > 0 && appdata.secret.length > 0)
        $location.path('/tracker');
    }
}]);

awstracker.controller('AwsController', ['$scope', 'data',
  function($scope, shareddata){
    $scope.shareddata = shareddata;

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
    $scope.regiondata = {
      volumes: [],
      notattached: 0,
      attached: 0,
      storage: 0,
      cost:0
    }
    $scope.volumes = [];
    $scope.total_storage = 0;
    $scope.total_cost = 0;

    $scope.init = function(region_name){
      $scope.aws = aws.make(region_name, shareddata.keyid, shareddata.secret);
      $scope.aws.findStoppedInstances().then(function(data){
        if(data.NextToken){
          console.log('there are more stopped instances');
        }
        $scope.reservations = data.Reservations;
        $scope.$apply();
      }).catch(function(err){
        console.log(err);
      });

      $scope.aws.findAvailableVolumes().then(function(data){
        if(data.NextToken){
          console.log('there are more available volumes');
        }
        $scope.regiondata.volumes.push.apply($scope.regiondata.volumes, data.Volumes);
        shareddata.volumes.push.apply(shareddata.volumes, data.Volumes);
        data.Volumes.forEach(function(volume){
          $scope.regiondata.storage += volume.Size;//Local Region scope
          $scope.regiondata.cost += 0.12*volume.Size;
          $scope.regiondata.notattached++;

          shareddata.storage += volume.Size;//All Region scope
          shareddata.cost += 0.12*volume.Size;
        })
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
          $scope.volumedata = data.Volumes[0];
          $scope.regiondata.volumes.push(data.Volumes[0]);
          shareddata.volumes.push(data.Volumes[0]);

          $scope.regiondata.storage += data.Volumes[0].Size;//Local Region scope
          $scope.regiondata.cost = 0.12*$scope.regiondata.storage;
          $scope.regiondata.attached++;

          shareddata.storage += data.Volumes[0].Size;//All Region scope
          shareddata.cost = 0.12*shareddata.storage;
        }
        $scope.$apply();
      }).catch(function(err){
        console.log(err);
      });
    }
}]);
