var card = angular.module('Cards', ['ngResource']);
card.controller('CardController', function($scope, $resource){
  $scope.$parent.accountNumber = "1000000007";
  var Card = $resource('/db/cards/list/' + $scope.$parent.accountNumber);
  $scope.cardNames = ["Classic Credit Card", "Vauxhall Card", "Aspire Elite Card", "Classic Extra Card", "Aspire Business Card"];
  $scope.cardImages = ["classiccreditcard-card.jpg", "vauxhall-card.jpg", "aspireelite-card.jpg", "classicextra-card.jpg", "aspirebusiness-card.png"];

  Card.get({}, function(cards) {
    $scope.cards = cards.cards;
    for(var i = 0; i < $scope.cards.length; i++) {
      var cardName = $scope.cards[i].cardName;
      $scope.cards[i].isBalPositive = $scope.cards[i].currentBalance >= 0;
      // $scope.cards[i].isBalPositive = false;
      for(var j = 0; j < $scope.cards.length; j++) {
        if(cardName == $scope.cardNames[j]) {
          $scope.cards[i].cardImage = $scope.cardImages[j];
        }
      }
    }

    console.log($scope.cards);
  });
});