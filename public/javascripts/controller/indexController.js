app.controller("indexController", [
  "$scope",
  "indexFactory",
  "configFactory",
  ($scope, indexFactory, configFactory) => {
    var min = 1;
    var max = 11;

    do {
      $scope.rasgelesayi = Math.floor(Math.random() * (max - min) + min);
    } while ($scope.rasgelesayi != 1);

    $scope.messages = [];

    $scope.init = () => {
      const username = prompt("Please enter user name");

      if (username) {
        initSocket(username);
      } else {
        return false;
      }
    };

    function showBubble(id, message) {
      $("#" + id)
        .find(".message")
        .show()
        .html(message);
      setTimeout(() => {
        $("#" + id)
          .find(".message")
          .hide();
      }, 2000);
    }

    function scrollTop() {
      setTimeout(() => {
        $("#chat-area")[0].scrollTop = $("#chat-area")[0].scrollHeight;
        // const element = document.getElementById("chat-area");
        // element.scrollTop = element.scrollHeight;
      });
    }

    function initSocket(username) {

      const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
      };

      configFactory.getConfig().then((socketUrl) => {


        console.log(socketUrl.data.socketUrl);


        indexFactory
          .connectSocket(socketUrl.data.socketUrl, connectionOptions)
          .then(socket => {
            //console.log("bağlantı gerçekti...", socket);

            socket.emit("newUser", { username });

            socket.on("initPlayers", players => {
              $scope.players = players;
              $scope.$apply();
              //console.log($scope.players);
            });

            socket.on("newUser", data => {
              const messageData = {
                type: { code: 0, message: 1 }, //
                username: data.username
              };
              //console.log(data);
              $scope.messages.push(messageData);
              $scope.players[data.id] = data;
              scrollTop();
              $scope.$apply();
            });

            socket.on("disUser", data => {
              const messageData = {
                type: { code: 0, message: 0 }, //
                username: data.username
              };
              //console.log(data);
              $scope.messages.push(messageData);
              delete $scope.players[data.id];
              scrollTop();
              $scope.$apply();
            });

            socket.on("animate", data => {
              $("#" + data.socketId).animate(
                { left: data.x, top: data.y },
                () => {
                  animate = false;
                }
              );
            });

            socket.on("newMessage", message => {
              $scope.messages.push(message);
              $scope.$apply();
              showBubble(message.socketId, message.text);
              scrollTop();
            });

            let animate = false;
            $scope.onClickPlayer = $event => {
              //console.log($event.offsetX + "/" + $event.offsetY)

              if (!animate) {
                let x = $event.offsetX;
                let y = $event.offsetY;

                socket.emit("animate", { x, y });

                animate = true;
                $("#" + socket.id).animate({ left: x, top: y }, () => {
                  animate = false;
                });
              }
            };

            $scope.newMessage = () => {
              if ($scope.message) {
                let message = $scope.message;
                const messageData = {
                  type: { code: 1, message: 1 },
                  username: username,
                  text: message
                };

                $scope.messages.push(messageData);
                $scope.message = "";

                socket.emit("newMessage", messageData);

                scrollTop(socket.id, message);
                showBubble(socket.id, message);
              }
            };
          })
          .catch(err => {
            console.log(err);
          });

        
      });
    }
  }
]);
