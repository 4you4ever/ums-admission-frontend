'use strict';

angular.module('admissionSystemApp')
  .service('decodeSpecofferSvc', ['$http', '$q', 'DictionariesSvc', function ($http, $q, DictionariesSvc) {

    this.allProposalsDecoded = function (params) {
      var specialtyNames = [],
        departmentNames = [],
        timePeriodCourseNames = [],
        specofferTypeNames = [],
        eduFormTypeNames = [];

      function pushData(data, array) {
        angular.forEach(data, function (item) {
          array[item.id] = item.name;
        });
      }

      return DictionariesSvc.getAllSpecoffers(params).then(function (proposals) {
        var rawProposals = angular.copy(proposals);

        return $q.all([
          DictionariesSvc.getAllSpecialties(),
          DictionariesSvc.getAllDepartments({
            departmentTypeId: 1
          }),
          DictionariesSvc.getTimePeriodCourseIds(),
          DictionariesSvc.getSpecoffersTypes(),
          DictionariesSvc.getEduformTypes()
        ])
          .then(function (res) {
            pushData(res[0], specialtyNames);
            pushData(res[1], departmentNames);
            pushData(res[2], timePeriodCourseNames);
            pushData(res[3], specofferTypeNames);
            pushData(res[4], eduFormTypeNames);

            angular.forEach(rawProposals, function (item) {
              item.specialtyId = specialtyNames[item.specialtyId];
              item.departmentId = departmentNames[item.departmentId];
              item.timePeriodCourseId = timePeriodCourseNames[item.timePeriodCourseId];
              item.specofferTypeId = specofferTypeNames[item.specofferTypeId];
              item.educationFormTypeId = eduFormTypeNames[item.educationFormTypeId];
            });
            return rawProposals;
          });
      });
    };
  }]);
