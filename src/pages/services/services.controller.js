import find from 'lodash/find';

export class ServicesController {
  /** @ngInject */
  constructor(SweetAlert, ServicesService, $mdDialog) {
    this.$mdDialog = $mdDialog;
    this.SweetAlert = SweetAlert;
    this.ServicesService = ServicesService;
  }

  reload() {
    this.ServicesService.getCategories().then(data => angular.extend(this.categories, data));
    this.ServicesService.getUserServices().then(data => this.services = data);
  }

  existService(name) {
    var service = find(this.services, {name: name});
    return service ? service.price : null;
  }

  deleteService(obj) {
    var service = find(this.services, {name: obj.name});
    if (service) {
      this.ServicesService.remove(service.id).then(() => {
        this.reload();
      });
    }
  }

  create(ev, obj) {
    this.showServiceModal(ev, 0, obj.name)
      .then((price) => {
        this.ServicesService.create({sub_category_id: obj.id, price}).then(data => this.reload());
      });
  }

  edit(ev, obj) {
    var service = find(this.services, {name: obj.name});
    if (service)
      this.showServiceModal(ev, service.price, obj.name)
        .then((price) => {
          this.ServicesService.edit(service.id, {price}).then(data => this.reload());
        });
  }

  showServiceModal(ev, price, name) {
    return this.$mdDialog.show({
      controller: DialogController,
      template: require('./services-add.html'),
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      resolve: {
        price: () => parseInt(price),
        name: () => name,
      }
    });
  }

}

/** @ngInject */
function DialogController($scope, $mdDialog, price, name) {
  $scope.name = name;
  $scope.price = price;
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.answer = function (answer) {
    if (parseInt(answer) < 0) return;
    $mdDialog.hide(answer);
  };
}
