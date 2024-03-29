(function(angular) {
    'use strict';
    angular
      .module('FileManagerApp')
      .provider('fileManagerConfig', function(API) {

        var values = {
            appName: 'Documents',
            defaultLang: 'it',

            listMattersUrl: API.host + '/api/documents/list_matters',
            listUrl: API.host + '/api/documents/list',
            uploadUrl: API.host + '/api/documents/upload',
            renameUrl: API.host + '/api/documents/update',
            copyUrl: 'bridges/php/handler.php',
            moveUrl: 'bridges/php/handler.php',
            removeUrl: API.host + '/api/documents/delete',
            editUrl: 'bridges/php/handler.php',
            getContentUrl: 'bridges/php/handler.php',
            createFolderUrl: API.host + '/api/documents/create_folder',
            downloadFileUrl: 'bridges/php/handler.php',
            downloadMultipleUrl: 'bridges/php/handler.php',
            compressUrl: 'bridges/php/handler.php',
            extractUrl: 'bridges/php/handler.php',
            permissionsUrl: 'bridges/php/handler.php',

            searchForm: true,
            sidebar: true,
            breadcrumb: true,
            allowedActions: {
              upload: true,
              rename: true,
              move: true,
              copy: true,
              edit: true,
              changePermissions: true,
              compress: true,
              compressChooseName: true,
              extract: true,
              download: true,
              downloadMultiple: true,
              preview: true,
              remove: true
            },

            multipleDownloadFileName: 'angular-filemanager.zip',
            showSizeForDirectories: false,
            useBinarySizePrefixes: false,
            downloadFilesByAjax: true,
            previewImagesInModal: true,
            enablePermissionsRecursive: true,
            hidePermissions: true,
            hideSize: true,
            hideDate: false,
            compressAsync: false,
            extractAsync: false,

            isEditableFilePattern: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|.html|cfm|cgi|aspx?|ini|pl|py|md|css|cs|js|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst)$/i,
            isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
            isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
            tplPath: 'views/file-manager'
        };

        return {
          $get: function() {
            return values;
          },
          set: function (constants) {
            angular.extend(values, constants);
          }
        };

    });
})(angular);
