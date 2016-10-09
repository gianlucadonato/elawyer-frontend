(function(angular) {
  'use strict';

  angular
    .module('FileManagerApp')
    .factory('item', ['fileManagerConfig', 'chmod', function(fileManagerConfig, Chmod) {

      var Item = function(model, path, parentId) {
        var rawModel = {
          id: model && model.id || '',
          name: model && model.name || '',
          type: model && isFile(model.mimeType) ? 'file' : 'dir',
          mimeType: model && model.mimeType || '',
          size: model && parseInt(model.size || 0),
          createdTime: model && model.createdTime,
          webContentLink: model && model.webContentLink,
          webViewLink: model && model.webViewLink,
          iconLink: model && model.iconLink,
          parents: model && model.parents,
          perms: new Chmod(model && model.rights),
          path: path || [],
          content: model && model.content || '',
          recursive: false,
          fullPath: function() {
            var path = this.path.filter(Boolean);
            return ('/' + path.join('/') + '/' + this.name).replace(/\/\//, '/');
          }
        };

        this.error = '';
        this.processing = false;

        this.model = angular.copy(rawModel);
        this.tempModel = angular.copy(rawModel);

        function parseMySQLDate(mysqlDate) {
          var d = (mysqlDate || '').toString().split(/[- :]/);
          return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
        }

        function isFile(type) {
          if(!type) return false;
          return ['dir','application/vnd.google-apps.folder'].indexOf(type) < 0;
        }
      };

      Item.prototype.update = function() {
        angular.extend(this.model, angular.copy(this.tempModel));
      };

      Item.prototype.revert = function() {
        angular.extend(this.tempModel, angular.copy(this.model));
        this.error = '';
      };

      Item.prototype.isFile = function(type) {
        return ['dir','application/vnd.google-apps.folder'].indexOf(type) < 0;
      };

      Item.prototype.isFolder = function() {
        return !this.isFile(this.model.type);
      };

      Item.prototype.isType = function(type) {
        var isFile = this.isFile(this.model.type);
        if(type === 'dir') isFile = !isFile;
        return isFile;
      };

      Item.prototype.isEditable = function() {
        return !this.isFolder() && fileManagerConfig.isEditableFilePattern.test(this.model.name);
      };

      Item.prototype.isImage = function() {
        return fileManagerConfig.isImageFilePattern.test(this.model.name);
      };

      Item.prototype.isCompressible = function() {
        return this.isFolder();
      };

      Item.prototype.isExtractable = function() {
        return !this.isFolder() && fileManagerConfig.isExtractableFilePattern.test(this.model.name);
      };

      return Item;
  }]);
})(angular);
