(function () {
    'use Strict';
    angular.module('cinema')
        .controller('ArtistController', ArtistController);
    /** @ngInject */
    function ArtistController(tmdbTV, CinemaService, $location, $rootScope, $sce, $filter, ArtistService, tmdbMovie, $scope, $routeParams) {
        var vm = this;
        var param = {
            "language": "en-US",
            "page": 1,
            "with_people": 0
        };
        var pageCount = {
            "artistMoviesStatus": false
        }
        init();

        function init() {
            if (!ArtistService.selectedArtist) {
                getArtistDetailsById($routeParams.id);
            } else {
                vm.artistBio = "";

                vm.artistMovies = {
                    "page": "",
                    "list": [],
                    "totalPage": "",
                    "sortBy": []
                };
                vm.selectedArtist = ArtistService.getSelectedArtist();
                $rootScope.headerTitle = vm.selectedArtist.name;
                $rootScope.direction = 1;
                console.log("SelectedArtist", vm.selectedArtist);
                if (angular.isDefined(vm.selectedArtist)) {
                    loadData();
                }
            }
        }

        $scope.$on('refresh', function ($event, data) {
            init();
        });

        function getArtistDetailsById(id) {
            tmdbMovie.getArtistById(id, param, function successCallback(success) {
                ArtistService.setSelectedArtist(success);
                $scope.$broadcast('refresh', success);
            }, function errorCallback() {
            });
        }

        vm.artistMoviesSwiper = function (swiper) {
            swiper.initObservers();
            swiper.on('onReachEnd', function () {
                if (vm.artistMovies.page < vm.artistMovies.totalPage && pageCount.artistMoviesStatus) {
                    pageCount.artistMoviesStatus = false;
                    param.page = angular.copy(vm.artistMovies.page) + 1;
                    getmovies();
                }
            });
        };

        function loadData() {
            getmovies();
            // getTvShows();
            getBio();
        }

        function setterData(request, response) {
            request.page = response.page;
            request.totalPage = response.total_pages;
            request.list = request.list.concat(response.results);
            return request;
        }

        function getmovies() {
            param.with_people = vm.selectedArtist.id;
            tmdbMovie.discover(param,
                function success(success) {
                    if (success.hasOwnProperty('results')) {
                        if (success.results.length > 0) {
                            pageCount.artistMoviesStatus = true;
                            vm.artistMovies = setterData(vm.artistMovies, success);
                            vm.artistMovies.sortBy.push('-vote_average');
                        }
                    }
                },
                function error() {
                    console.log("error", angular.toJson(error));
                });
        }

        function getTvShows() {
            param.with_people = vm.selectedArtist.id;
            tmdbTV.tv.discover(param, function successCallback(success) {
                console.log("ArtistTv", success);
            }, function errorCallback(error) {
            });
        }

        vm.calculateAge = function (birthday, deathday) {
            var diffInYear = "";
            if ((angular.isString(birthday) && birthday != "")) {
                var dob = new Date(birthday);
                var currentDt = new Date();
                if ((angular.isString(deathday) && deathday != "")) {
                    var deathDate = new Date(deathday);
                    if (angular.isDate(deathDate)) {
                        diffInYear = (deathDate.getFullYear() - dob.getFullYear());
                    }
                } else {
                    diffInYear = (currentDt.getFullYear() - dob.getFullYear());
                }
            }
            return diffInYear; pageCount.artistMoviesStatus
        }

        function getBio() {
            ArtistService.getArtistInfo(vm.selectedArtist.id).then(successCallback, errorCallback);

            function successCallback(successBio) {
                vm.artistBio = successBio.data;
                console.log("artistBio", vm.artistBio);
            }

            function errorCallback(error) {
                console.log("artist bio", angular.toJson(error));
            }
        }

        vm.openMovieWiki = function (movie) {
            CinemaService.collection.setSelectedMovie(movie);
            $location.path('/movieWiki/' + movie.id);
        }

    }
})();