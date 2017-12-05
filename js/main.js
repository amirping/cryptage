angular.module('app', ['ui.bootstrap', 'ngAnimate', 'ngSanitize'])
  .controller('mainController', function($scope) {
    $scope.input = "";
    $scope.output = "";
    $scope.all_cryptage = ['affine', 'playfair', 'transposition', 'césar', 'vignere'];
    $scope.cryptage_type = -1;
    $scope.shift = "";
    $scope.mult = 1;
    $scope.add = 1;
    $scope.keyvals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    $scope.multkeys = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    $scope.crypte = function() {
      if ($scope.cryptage_type == -1 || $scope.input.length == 0) {
        alert("you have to select type , and give text ");
        return false;
      } else {
        switch ($scope.cryptage_type) {
          case 3:
            $scope.output = caesarShift($scope.input, parseInt($scope.shift));
            break;
          case 4:
            $scope.output = vigenereCrypte($scope.input, $scope.shift);
            break;
          case 0:
            $scope.output = affineCrypte($scope.input, $scope.mult, $scope.add);
            break;
          default:
            alert("not ready yet");
        }
        return true;
      }
    };
    $scope.decrypte = function() {
      console.log("i work ");
      if ($scope.cryptage_type == -1 || $scope.output.length == 0) {
        alert("you have to select type , and give text ");
        return false;
      } else {
        switch ($scope.cryptage_type) {
          case 3:
            $scope.input = caesarShift($scope.output, parseInt($scope.shift) * -1);
            break;
          case 4:
            $scope.input = vigenereDecrypt($scope.output, $scope.shift);
            break;
          case 0:
            $scope.input = affineDecrypte($scope.output, $scope.mult, $scope.add);
            break;
          default:
            alert('not ready yet');
        }
        return true;
      }
    };
    // cesar fn
    var caesarShift = function(str, amount) {
      // Wrap the amount
      if (amount < 0)
        return caesarShift(str, amount + 26);
      // Make an output variable
      var output = '';
      // Go through each character
      for (var i = 0; i < str.length; i++) {
        // Get the character we'll be appending
        var c = str[i];
        // If it's a letter...
        if (c.match(/[a-z]/i)) {
          // Get its code
          var code = str.charCodeAt(i);
          // Uppercase letters
          if ((code >= 65) && (code <= 90))
            c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
          // Lowercase letters
          else if ((code >= 97) && (code <= 122))
            c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
        }
        // Append
        output += c;
      }
      // All done!
      return output;
    };
    var vigenereCrypte = function(input, key) // fonction de cryptage
    {
      var longueur = input.length; //on récupère la longueur du message
      while (key.length < input.length) { //tant que la clé est trop courte, on la rallonge
        key = key + key;
      }
      var currentchar = 0; //adresse du caractère en cour de traitement
      var result = ""; //résultat
      var crypted; //Valeur  ASCII du caractère crypté
      while (currentchar < longueur) { //Tant que l'on a pas atteint la fin de la chaîne
        crypted = input.charCodeAt(currentchar) + key.charCodeAt(currentchar); // Valeur ASCII caractère crypté = Valeur ASCII caractère message+Valeur ASCII caractère clé
        if (crypted > 127) { //si valeur obtenue est supérieure à 127, on lui retire 127 pour rester dans la table accéptée
          crypted = crypted - 127;
        }
        result = result + String.fromCharCode(crypted); // Ajout du caractère crypté à la chaine résultat
        currentchar = currentchar + 1; //On avance de 1 dans le traitement de la chaine
      }
      return result;
    }
    var vigenereDecrypt = function(input, key) // fonction de décryptage
    {
      var longueur = input.length;
      while (key.length < input.length) {
        key = key + key;
      }
      var currentchar = 0;
      var result = "";
      var uncrypted;
      while (currentchar < longueur) {
        uncrypted = input.charCodeAt(currentchar) - key.charCodeAt(currentchar);
        if (uncrypted < 0) {
          uncrypted = uncrypted + 127;
        }
        result = result + String.fromCharCode(uncrypted);
        currentchar = currentchar + 1;
      }
      return result;
    }
    var affineCrypte = function(input, multkey, addkey) {
      var word, newword, code, newcode, newletter;
      word = input;
      word = word.toUpperCase();
      word = word.replace(/\W/g, "");
      newword = ""
      for (i = 0; i < word.length; i++) {
        code = word.charCodeAt(i) - 65
        newcode = ((multkey * code + addkey) % 26) + 65;
        newletter = String.fromCharCode(newcode);
        if ((i % 5 == 0) && (i > 0)) {
          newword += " ";
        };
        newword = newword + newletter;
      }
      return newword + " "
    }
    var affineDecrypte = function(output, multkey, addkey) {
      var word, newword, code, newcode, newletter;
      var multinverse;
      word = output;
      word = word.toUpperCase();
      word = word.replace(/\W/g, "");
      multinverse = 1
      for (i = 1; i <= 25; i = i + 2) {
        if ((multkey * i) % 26 == 1) {
          multinverse = i
        }
      }
      newword = ""
      for (i = 0; i < word.length; i++) {
        code = word.charCodeAt(i) - 65
        newcode = ((multinverse * (code + 26 - addkey)) % 26) + 65
        newletter = String.fromCharCode(newcode)
        newword = newword + newletter
      }
      return newword.toUpperCase();
    }
  });
