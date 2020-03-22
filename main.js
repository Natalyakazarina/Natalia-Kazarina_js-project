var tab;
var tabContent;
var taskName = document.querySelector('[name="task-name"]').value;
var taskDescription = document.querySelector('[name="task-description"]').value;
var taskPriority = document.querySelector('[name="task-priority"]').value;
var id;
var num;
var del;
var fields = document.querySelectorAll("input");
document.querySelector(".edit").disabled = true;
(function() {
  event();
  if (localStorage.getItem("ourData") !== null) {
    data = JSON.parse(localStorage.getItem("ourData"));
  } else {
    localStorage.setItem("ourData", JSON.stringify(data));
  }
  getCurrentTable();
  getCompletedTable();
  getRemovedTable();
  clearForm();
})();

window.onload = function() {
  tabContent = document.querySelectorAll(".tabContent");
  tab = document.querySelectorAll(".tab");
  hideTabsContent(1);
};

document.querySelector(".tabs").addEventListener("click", function(event) {
  var target = event.target;
  if (target.className == "tab") {
    for (var i = 0; i < tab.length; i++) {
      if (target == tab[i]) {
        showTabsContent(i);
        break;
      }
    }
  }
});

function hideTabsContent(a) {
  for (var i = a; i < tabContent.length; i++) {
    tabContent[i].classList.remove("show");
    tabContent[i].classList.add("hide");
    tab[i].classList.remove("whiteborder");
  }
}

function showTabsContent(index) {
  if (tabContent[index].classList.contains("hide")) {
    hideTabsContent(0);
    tab[index].classList.add("whiteborder");
    tabContent[index].classList.remove("hide");
    tabContent[index].classList.add("show");
  }
}

function event() {
  var _editObj = null;
  var input = document.querySelectorAll(".field");
  document.querySelector(".add").addEventListener("click", function(e) {
    for (var i = 0; i < input.length; i++) {
      if (input[i].classList.contains("required") && !input[i].value.length) {
        input[i].classList.add("_error");
        return;
      } else {
        input[i].classList.remove("_error");
      }
    }
    e.preventDefault();
    data.task.push({
      taskName: input[0].value,
      taskDescription: input[1].value,
      priority: input[2].value
    });
    localStorage.setItem("ourData", JSON.stringify(data));
    getCurrentTable();
  });
  document.querySelector(".edit").addEventListener("click", function(e) {
    e.preventDefault();
    let taskData = {
      taskName: input[0].value,
      taskDescription: input[1].value,
      priority: input[2].value
    };
    if (data.task[_editObj] != taskData) {
      data.task.splice(_editObj, 1, taskData);
      _editObj = null;
    }
    if (document.querySelector(".edit").disabled == false) {
      document.querySelector(".edit").disabled = true;
    }
    localStorage.setItem("ourData", JSON.stringify(data));
    getCurrentTable();
  });
  document.addEventListener("click", function(e) {
    var ed;
    if (e.target.className === "edit-btn") {
      //            ed = +(e.target.getAttribute("data-ed"));
      ed = +e.target.closest("tr").dataset.ed;
      var input = document.querySelectorAll(".field");
      _editObj = ed;
      input[0].value =
        data.task[e.target.getAttribute("data-amendments")].taskName;
      input[1].value =
        data.task[e.target.getAttribute("data-amendments")].taskDescription;
      input[2].value =
        data.task[e.target.getAttribute("data-amendments")].priority;
      document.querySelector(".edit").disabled = false;
    }
  });
  getCurrentTable();
}

window.addEventListener("click", function(e) {
  switch (e.target.getAttribute("data-name")) {
    case "current-remove":
      var deleted_task = data.task[e.target.getAttribute("data-id")];
      var pepega = data.task.splice(e.target.getAttribute("data-id"), 1);
      data.removed.push(deleted_task);
      localStorage.setItem("ourData", JSON.stringify(data));
      getCurrentTable();
      getRemovedTable();
      break;

    case "current-done":
      data.task
        .splice(e.target.getAttribute("data-done"), 1)
        .forEach(function(item) {
          data.completed.push(item);
        });
      localStorage.setItem("ourData", JSON.stringify(data));
      getCompletedTable();
      getCurrentTable();
      break;

    case "completed-remove":
      data.completed
        .splice(e.target.getAttribute("data-num"), 1)
        .forEach(function(item) {
          data.removed.push(item);
        });
      localStorage.setItem("ourData", JSON.stringify(data));
      getCompletedTable();
      getRemovedTable();
      break;

    case "removed-restore":
      data.removed
        .splice(e.target.getAttribute("data-del"), 1)
        .forEach(function(item) {
          data.task.push(item);
        });
      localStorage.setItem("ourData", JSON.stringify(data));
      getRemovedTable();
      getCurrentTable();
      break;

    case "removed-clear":
      data.removed.splice(e.target.getAttribute("data-clear"), 1);
      localStorage.setItem("ourData", JSON.stringify(data));
      getRemovedTable();
      break;
  }
});

function clearForm() {
  var input = document.querySelectorAll(".field");
  for (var i = 0; i < input.length; i++) {
    input[i].value = "";
  }
}

function getCurrentTable() {
  var str = "";
  for (var i = 0; i < data.task.length; i++) {
    str +=
      '<tr data-ed="' +
      i +
      '"><td>' +
      data.task[i].taskName +
      "</td><td>" +
      data.task[i].taskDescription +
      "</td><td>" +
      data.task[i].priority +
      '</td><td><button data-name="current-done" data-done="' +
      i +
      '" class="done-btn">выполнено</button><button data-id="' +
      i +
      '" data-name="current-remove" class="remove-btn">удалить</button><button data-name="edit-btn" data-amendments="' +
      i +
      '" class="edit-btn">редактировать</button></td></tr>';
  }

  document.querySelector(".table-current").innerHTML = str;
  clearForm();
}

function getCompletedTable() {
  var str = "";
  for (var i = 0; i < data.completed.length; i++) {
    str +=
      "<tr><td>" +
      data.completed[i].taskName +
      "</td><td>" +
      data.completed[i].taskDescription +
      "</td><td>" +
      data.completed[i].priority +
      '</td><td><button data-name="completed-remove" data-num="' +
      i +
      '" class="remove-button">удалить</button></td></tr>';
  }

  document.querySelector(".table-completed").innerHTML = str;
  clearForm();
}

function getRemovedTable() {
  var str = "";
  for (var i = 0; i < data.removed.length; i++) {
    str +=
      "<tr><td>" +
      data.removed[i].taskName +
      "</td><td>" +
      data.removed[i].taskDescription +
      "</td><td>" +
      data.removed[i].priority +
      '</td><td><button data-name="removed-restore" data-del="' +
      i +
      '" class="restore-btn">восстановить</button><button data-name="removed-clear" data-clear="' +
      i +
      '" class="clear-btn">очистить</button></td></tr>';
  }
  document.querySelector(".table-removed").innerHTML = str;
  clearForm();
}
