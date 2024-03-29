(function(angular) {
  'use strict';
  angular
    .module('FileManagerApp')
    .service('fileNavigator', [
      '$rootScope', 'apiMiddleware', 'fileManagerConfig', 'item',
      function ($rootScope, ApiMiddleware, fileManagerConfig, Item) {

      var FileNavigator = function() {
        this.apiMiddleware = new ApiMiddleware();
        this.requesting = false;
        this.fileList = [];
        this.currentPath = [];
        this.clickedFolders = {};
        this.rootFolderId = '';
        this.currentFolderId = '';
        this.currentUserId = '';
        this.history = [];
        this.error = '';
        this.onRefresh = function() {};
      };

      FileNavigator.prototype.deferredHandler = function(data, deferred, defaultMsg) {
        if (!data || typeof data !== 'object') {
          this.error = 'Bridge response error, please check the docs';
        }
        if (!this.error && data.result && data.result.error) {
          this.error = data.result.error;
        }
        if (!this.error && data.error) {
          this.error = data.error.message;
        }
        if (!this.error && defaultMsg) {
          this.error = defaultMsg;
        }
        if (this.error) {
          return deferred.reject(data);
        }
        return deferred.resolve(data);
      };

      FileNavigator.prototype.listMatters = function(params) {
        if(!params) params = {};
        return this.apiMiddleware.listMatters(params, this.currentPath, this.deferredHandler.bind(this));
      };

      FileNavigator.prototype.list = function(params) {
        if(!params) params = {};
        return this.apiMiddleware.list(params, this.currentPath, this.deferredHandler.bind(this));
      };

      FileNavigator.prototype.refresh = function() {
        var self = this;
        var path = self.currentPath.join('/');
        self.requesting = true;
        self.fileList = [];
        if(!path) {
          if(this.rootFolderId.toString() === 'matters')
            return self.listMatters({
              user_id: self.currentUserId
            }).then(cb).finally(function() {
              self.requesting = false;
            });
          else {
            return self.list({
              file_id: self.rootFolderId
            }).then(cb).finally(function() {
              self.requesting = false;
            });
          }
        } else {
          return self.list({
            file_id: self.currentFolderId
          }).then(cb).finally(function() {
            self.requesting = false;
          });
        }
        function cb(data) {
          self.fileList = (data.result || []).map(function(file) {
            return new Item(file, self.currentPath);
          });
          self.buildTree(path);
          self.onRefresh();
        }
      };

      FileNavigator.prototype.buildTree = function(path) {
        var flatNodes = [], selectedNode = {};

        function recursive(parent, item, path) {
          var absName = path ? (path + '/' + item.model.name) : item.model.name;
          if (parent.name.trim() && path.trim().indexOf(parent.name) !== 0) {
            parent.nodes = [];
          }
          if (parent.name !== path) {
            parent.nodes.forEach(function(nd) {
              recursive(nd, item, path);
            });
          } else {
            for (var e in parent.nodes) {
              if (parent.nodes[e].name === absName) {
                return;
              }
            }
            parent.nodes.push({item: item, name: absName, nodes: []});
          }
          parent.nodes = parent.nodes.sort(function(a, b) {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() === b.name.toLowerCase() ? 0 : 1;
          });
        }

        function flatten(node, array) {
          array.push(node);
          for (var n in node.nodes) {
            flatten(node.nodes[n], array);
          }
        }

        function findNode(data, path) {
          return data.filter(function (n) {
            return n.name === path;
          })[0];
        }

        !this.history.length && this.history.push({name: '', nodes: []});
        flatten(this.history[0], flatNodes);
        selectedNode = findNode(flatNodes, path);
        selectedNode && (selectedNode.nodes = []);

        for (var o in this.fileList) {
          var item = this.fileList[o];
          item instanceof Item && item.isFolder() && recursive(this.history[0], item, path);
        }
      };

      FileNavigator.prototype.folderClick = function(item) {
        this.currentPath = [];
        if (item && item.isType('dir')) {
          this.currentPath = item.model.fullPath().split('/').splice(1);
          this.clickedFolders[this.currentPath[this.currentPath.length-1]] = item.model.id;
          this.currentFolderId = item.model.id;
        }
        this.refresh();
      };

      FileNavigator.prototype.upDir = function() {
        if (this.currentPath[0]) {
          this.currentPath = this.currentPath.slice(0, -1);
          this.refresh();
        }
      };

      FileNavigator.prototype.goTo = function(index, dir) {
        this.currentPath = this.currentPath.slice(0, index + 1);
        this.currentFolderId = this.clickedFolders[dir];
        this.refresh();
      };

      FileNavigator.prototype.fileNameExists = function(fileName) {
        return this.fileList.find(function(item) {
          return fileName.trim && item.model.name.trim() === fileName.trim();
        });
      };

      FileNavigator.prototype.listHasFolders = function() {
        return this.fileList.find(function(item) {
          return item.isType('dir');
        });
      };

      return FileNavigator;
  }]);
})(angular);
