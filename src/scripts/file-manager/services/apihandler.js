(function(angular, $) {
    'use strict';
    angular
      .module('FileManagerApp')
      .service('apiHandler', ['$http', '$q', '$window', '$translate', 'Upload',
        function ($http, $q, $window, $translate, Upload) {

        $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        var ApiHandler = function() {
          this.inprocess = false;
          this.asyncSuccess = false;
          this.error = '';
        };

        ApiHandler.prototype.deferredHandler = function(data, deferred, defaultMsg) {
          if (!data || typeof data !== 'object') {
            this.error = 'Bridge response error, please check the docs';
          }
          if (data.result && data.result.error) {
            this.error = data.result.error;
          }
          if (!this.error && data.error) {
            this.error = data.error.message;
          }
          if (!this.error && (data.error || {}).errors) {
            this.error = data.error.errors[0].message;
          }
          if (!this.error && defaultMsg) {
            this.error = defaultMsg;
          }
          if (this.error) {
            return deferred.reject(data);
          }
          return deferred.resolve(data);
        };

        ApiHandler.prototype.list = function(data, apiUrl, path, customDeferredHandler) {
          var self = this;
          var dfHandler = customDeferredHandler || self.deferredHandler;
          var deferred = $q.defer();

          data.action = 'list';
          data.path = path;
          self.inprocess = true;
          self.error = '';

          $http.post(apiUrl, data).success(function(data) {
            dfHandler(data, deferred);
          }).error(function(data) {
            dfHandler(data, deferred, 'Unknown error listing, check the response');
          })['finally'](function() {
            self.inprocess = false;
          });
          return deferred.promise;
        };

        ApiHandler.prototype.copy = function(apiUrl, items, path) {
            var self = this;
            var deferred = $q.defer();
            var data = {
                action: 'copy',
                items: items,
                newPath: path
            };

            self.inprocess = true;
            self.error = '';
            $http.post(apiUrl, data).success(function(data) {
                self.deferredHandler(data, deferred);
            }).error(function(data) {
                self.deferredHandler(data, deferred, $translate.instant('error_copying'));
            })['finally'](function() {
                self.inprocess = false;
            });
            return deferred.promise;
        };

        ApiHandler.prototype.move = function(apiUrl, items, path) {
          var self = this;
          var deferred = $q.defer();
          var data = {
            action: 'move',
            items: items,
            newPath: path
          };
          self.inprocess = true;
          self.error = '';
          $http.post(apiUrl, data).success(function(data) {
            self.deferredHandler(data, deferred);
          }).error(function(data) {
            self.deferredHandler(data, deferred, $translate.instant('error_moving'));
          })['finally'](function() {
            self.inprocess = false;
          });
          return deferred.promise;
        };

        ApiHandler.prototype.remove = function(apiUrl, items) {
          var self = this;
          var deferred = $q.defer();
          var data = {
            action: 'remove',
            fileIds: items
          };
          self.inprocess = true;
          self.error = '';
          $http.post(apiUrl, data).success(function(data) {
            self.deferredHandler(data, deferred);
          }).error(function(data) {
            self.deferredHandler(data, deferred, $translate.instant('error_deleting'));
          })['finally'](function() {
            self.inprocess = false;
          });
          return deferred.promise;
        };

        ApiHandler.prototype.upload = function(apiUrl, parentId, files) {
          var self = this;
          var deferred = $q.defer();
          self.inprocess = true;
          self.progress = 0;
          self.error = '';

          var data = {
            parentId: parentId,
          };

          for (var i = 0; i < files.length; i++) {
            var fileName = files[i].name || 'file-'+i;
            data[fileName] = files[i];
          }

          if (files && files.length) {
            Upload.upload({
              url: apiUrl,
              data: data
            }).then(function (data) {
              self.deferredHandler(data, deferred);
            }, function (data) {
              self.deferredHandler(data, deferred, 'Unknown error uploading files');
            }, function (evt) {
              self.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total)) - 1;
            })['finally'](function() {
              self.inprocess = false;
              self.progress = 0;
            });
          }
          return deferred.promise;
        };

        ApiHandler.prototype.getContent = function(apiUrl, itemPath) {
            var self = this;
            var deferred = $q.defer();
            var data = {
                action: 'getContent',
                item: itemPath
            };

            self.inprocess = true;
            self.error = '';
            $http.post(apiUrl, data).success(function(data) {
                self.deferredHandler(data, deferred);
            }).error(function(data) {
                self.deferredHandler(data, deferred, $translate.instant('error_getting_content'));
            })['finally'](function() {
                self.inprocess = false;
            });
            return deferred.promise;
        };

        ApiHandler.prototype.edit = function(apiUrl, itemPath, content) {
            var self = this;
            var deferred = $q.defer();
            var data = {
                action: 'edit',
                item: itemPath,
                content: content
            };

            self.inprocess = true;
            self.error = '';

            $http.post(apiUrl, data).success(function(data) {
                self.deferredHandler(data, deferred);
            }).error(function(data) {
                self.deferredHandler(data, deferred, $translate.instant('error_modifying'));
            })['finally'](function() {
                self.inprocess = false;
            });
            return deferred.promise;
        };

        ApiHandler.prototype.rename = function(apiUrl, item) {
          var self = this;
          var deferred = $q.defer();
          var data = {
            action: 'rename',
            fileId: item.model.id,
            name: item.tempModel.name
          };
          console.log('new name', item.tempModel.name);
          self.inprocess = true;
          self.error = '';
          $http.post(apiUrl, data).success(function(data) {
            self.deferredHandler(data, deferred);
          }).error(function(data) {
            self.deferredHandler(data, deferred, $translate.instant('error_renaming'));
          })['finally'](function() {
            self.inprocess = false;
          });
          return deferred.promise;
        };

        ApiHandler.prototype.getUrl = function(apiUrl, path) {
          var data = {
            action: 'download',
            path: path
          };
          return path && [apiUrl, $.param(data)].join('?');
        };

        ApiHandler.prototype.download = function(apiUrl, itemPath, toFilename, downloadByAjax, forceNewWindow) {
            var self = this;
            var url = this.getUrl(apiUrl, itemPath);

            if (!downloadByAjax || forceNewWindow || !$window.saveAs) {
                !$window.saveAs && $window.console.error('Your browser dont support ajax download, downloading by default');
                return !!$window.open(url, '_blank', '');
            }

            var deferred = $q.defer();
            self.inprocess = true;
            $http.get(url).success(function(data) {
                var bin = new $window.Blob([data]);
                deferred.resolve(data);
                $window.saveAs(bin, toFilename);
            }).error(function(data) {
                self.deferredHandler(data, deferred, $translate.instant('error_downloading'));
            })['finally'](function() {
                self.inprocess = false;
            });
            return deferred.promise;
        };

        ApiHandler.prototype.downloadMultiple = function(apiUrl, items, toFilename, downloadByAjax, forceNewWindow) {
            var self = this;
            var deferred = $q.defer();
            var data = {
                action: 'downloadMultiple',
                items: items,
                toFilename: toFilename
            };
            var url = [apiUrl, $.param(data)].join('?');

            if (!downloadByAjax || forceNewWindow || !$window.saveAs) {
                !$window.saveAs && $window.console.error('Your browser dont support ajax download, downloading by default');
                return !!$window.open(url, '_blank', '');
            }

            self.inprocess = true;
            $http.get(apiUrl).success(function(data) {
                var bin = new $window.Blob([data]);
                deferred.resolve(data);
                $window.saveAs(bin, toFilename);
            }).error(function(data) {
                self.deferredHandler(data, deferred, $translate.instant('error_downloading'));
            })['finally'](function() {
                self.inprocess = false;
            });
            return deferred.promise;
        };

        ApiHandler.prototype.compress = function(apiUrl, items, compressedFilename, path) {
            var self = this;
            var deferred = $q.defer();
            var data = {
                action: 'compress',
                items: items,
                destination: path,
                compressedFilename: compressedFilename
            };

            self.inprocess = true;
            self.error = '';
            $http.post(apiUrl, data).success(function(data) {
                self.deferredHandler(data, deferred);
            }).error(function(data) {
                self.deferredHandler(data, deferred, $translate.instant('error_compressing'));
            })['finally'](function() {
                self.inprocess = false;
            });
            return deferred.promise;
        };

        ApiHandler.prototype.extract = function(apiUrl, item, folderName, path) {
          var self = this;
          var deferred = $q.defer();
          var params = {
            action: 'extract',
            item: item,
            destination: path,
            folderName: folderName
          };

          self.inprocess = true;
          self.error = '';
          $http.post(apiUrl, params).success(function(data) {
            self.deferredHandler(data, deferred);
          }).error(function(data) {
            self.deferredHandler(data, deferred, $translate.instant('error_extracting'));
          })['finally'](function() {
            self.inprocess = false;
          });
          return deferred.promise;
        };

        ApiHandler.prototype.changePermissions = function(apiUrl, items, permsOctal, permsCode, recursive) {
          var self = this;
          var deferred = $q.defer();
          var params = {
            action: 'changePermissions',
            items: items,
            perms: permsOctal,
            permsCode: permsCode,
            recursive: !!recursive
          };

          self.inprocess = true;
          self.error = '';
          $http.post(apiUrl, params).success(function(data) {
            self.deferredHandler(data, deferred);
          }).error(function(data) {
            self.deferredHandler(data, deferred, $translate.instant('error_changing_perms'));
          })['finally'](function() {
            self.inprocess = false;
          });
          return deferred.promise;
        };

        ApiHandler.prototype.createFolder = function(apiUrl, params) {
          var self = this;
          var deferred = $q.defer();
          params.action = 'createFolder';

          self.inprocess = true;
          self.error = '';
          $http.post(apiUrl, params).success(function(data) {
            self.deferredHandler(data, deferred);
          }).error(function(data) {
            self.deferredHandler(data, deferred, $translate.instant('error_creating_folder'));
          })['finally'](function() {
            self.inprocess = false;
          });

          return deferred.promise;
        };

        return ApiHandler;

    }]);
})(angular, jQuery);
