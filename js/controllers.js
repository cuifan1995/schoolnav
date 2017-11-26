angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
   
        // Form data for the login modal
        $scope.loginData = {};
        $scope.imgSrc = "";//图片地址
        //***************************登陆modal   strat *********************************************
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            alert('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
        //***************************登陆modal    over*********************************************

    })
    .controller('browseCtrl', function ($scope) {//百度地图
        $scope.title="nihaobaidu "
        var mapPointA = new BMap.Point(119.55859,39.929333);
        var mapPointB = new BMap.Point(119.55859,39.929333);

        var alng=mapPointA.lng; //地理经度
        var alat=mapPointA.lat; //地理纬度
        var blng=mapPointB.lng;
        var blat=mapPointB.lat;
        var map = new BMap.Map("container"); //放到了布局div里
        map.enableScrollWheelZoom();                  // 启用滚轮放大缩小。
        map.enableKeyboard();                         // 启用键盘操作。
        map.centerAndZoom(mapPointA, 17);  // 初始化地图,设置中心点坐标和地图级别

    })
    .controller('PlaylistsCtrl', function ($scope,$http) {
        //http.get获取json数组。
        $http.get('json/data.json').success(function(data) {
            $scope.playlists = data.points;
        });
    })

    .controller('PlaylistCtrl', function ($scope, $http) {
        function getid(){
            var url = location.href;
            for (var i = url.length-2;i>0; i--)
            {
                if(url[i]=='/')break;
            }
            i+=1;
         return url.substr(i);
        }//字符串操作可愁死我了。
        $scope.id=getid();
        //获取该id的详细信息，
        $http.get('json/data.json').success(function(data) {
            $scope.playlist=data.points[$scope.id-1];//数组顺序一变就不行，json对象里的id查询怎么做。待解决
            var mapPointA = new BMap.Point($scope.playlist.lng,$scope.playlist.lna);
            console.log('$scope.playlist.lng='+$scope.playlist.lng);
            console.log('$scope.playlist.lna='+$scope.playlist.lna);
            var marker = new BMap.Marker(mapPointA);
            var map = new BMap.Map("container1"); //放到了布局div里
            map.enableScrollWheelZoom();                  // 启用滚轮放大缩小。
            map.enableKeyboard();                         // 启用键盘操作。
            map.centerAndZoom(mapPointA, 18);  // 初始化地图,设置中心点坐标和地图级别
            map.addOverlay(marker);//标记加入到图里
        });

    })
.controller('searchCtrl', function ($scope, $http,$ionicModal,$timeout) {
        $ionicModal.fromTemplateUrl('templates/search_select.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.closeSelect = function () {
            $scope.modal.hide();
        };
        $scope.selectStrat = function () {
            $scope.modal.show();//分别选择起点和终点
            $http.get('json/data.json').success(function(data) {
                $scope.playlists = data.points;
            });
        };
        // Perform the login action when the user submits the login form
        $scope.doSelectStart = function (a) {
            a-=1;
            $scope.start=$scope.playlists[a];
            $scope.closeSelect();
        };
        //End
        $ionicModal.fromTemplateUrl('templates/search_selectEnd.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalend = modal;
        });
        $scope.closeSelectend = function () {
            $scope.modalend.hide();
        };
        $scope.selectEnd = function () {
            $scope.modalend.show();//分别选择起点和终点
            $http.get('json/data.json').success(function(data) {
                $scope.playlistsend = data.points;
            });
        };
        $scope.doSelectEnd = function (a) {
            a-=1;
            $scope.end=$scope.playlistsend[a];
            $scope.closeSelectend();
        };
        $scope.selectok= function () {
            var startid=$scope.start.id;
            var endid=$scope.end.id;
            console.log('startid='+startid);
            console.log('endid='+endid);
            startid-=1;
            endid-=1;
            $http.get('json/data.json').success(function(data) { //获取边信息
                $scope.MGraph=data.MGraph;
                my($scope.MGraph);
            });//getend
           function my(MGraph){
               var INFINITY=99999;

               var D=new Array(MGraph.vexnum);
               for(var i=0;i<MGraph.vexnum;i++){
                   D[i]=new Array(MGraph.vexnum);
                   for(var j=0;j<MGraph.vexnum;j++)
                       D[i][j]=MGraph.AdjMatrix[i+1][j];
               }
              //经过这些操作，。。p数组终于。。终于。p[6][6][k]  ijk 0-5  泪奔呀。
               var pre=new Array(MGraph.vexnum);
               for(i=0;i<MGraph.vexnum;i++){
                   pre[i]=new Array(MGraph.vexnum);
                   for(k=0;k<MGraph.vexnum;k++)
                   {
                       pre[i][k]=i;
                   }
               }
               for(u=0;u<MGraph.vexnum;u++) 					//循环m次
                   for(v=0;v<MGraph.vexnum;v++) 					//循环m次
                       for(w=0;w<MGraph.vexnum;w++) 					//循环m次
                           if(D[v][u]+D[u][w]<D[v][w]) 			//若 vu距离+uw距离<vw距离， 对于每一对顶点 v和 w，看看是否存在一个顶点 u使得从 v 到 u 再到 w 比已知的路径v到w更短。如果是更新它。
                           {
                               D[v][w]=D[v][u]+D[u][w];
                               pre[v][w]=pre[u][w];    //vw距离改为vu距离+uw距离 变小了。
                           }// D就存最短距离了。
               var mendid=endid;
               var mstartid=startid;
               var pathresultzz=new Array();
               i=0;
               while((mstartid != pre[mstartid][mendid])) //前驱
               {
                   pathresultzz[i]=pre[mstartid][mendid]+1;
                   mendid = pre[mstartid][mendid];
                   i++;
               }
               var pathresultza=new Array();
               pathresultza[0]=startid+1;
               for(i=1;i<=pathresultzz.length;i++)
               {
                   pathresultza[i]=pathresultzz[pathresultzz.length-i];
               }
               j=endid+1;
               pathresultza[i+1]=j;
               console.log("pathresultza=",pathresultza);
               var resultstr='';
               for(i=0;i<pathresultza.length-2;i++)
               resultstr+=pathresultza[i]+"-->";
              resultstr+=pathresultza[i+1];

               $scope.shortpath=resultstr;
               $scope.shortm=D[startid][endid];
           }
        }
        
    })

;


