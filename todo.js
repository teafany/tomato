const { useState, useEffect } = React;

function ToDoApp() {
    var tasksState = React.useState([]);
    var taskInputState = React.useState("");
    var completedTasksState = React.useState([]);

    var tasks = tasksState[0];
    var setTasks = tasksState[1];

    var taskInput = taskInputState[0];
    var setTaskInput = taskInputState[1];

    var completedTasks = completedTasksState[0];
    var setCompletedTasks = completedTasksState[1];

    function loadTasks() {
        chrome.storage.local.get(["tasks", "completedTasks"], function (data) {
            if (data.tasks) {
                setTasks([...data.tasks]);
            }
            if (data.completedTasks) {
                setCompletedTasks([...data.completedTasks]);
            }
        });
    }

    function saveTasks(updatedTasks) {
        setTasks([...updatedTasks]);
        chrome.storage.local.set({ tasks: updatedTasks });
    }

    function addTask() {
        if (taskInput.trim() === "") {
            return;
        }
        var newTask = {
            name: taskInput.trim(),
            status: "not started",
            priority: "low",
            session: "none"
        };
        var newTasks = [...tasks, newTask];
        saveTasks(newTasks);
        setTaskInput("");
    }

    function completeTask(index) {
        const deletedTask = tasks[index];
        const updatedTasks = tasks.filter((_, i) => i !== index);
        const updatedCompleted = [...completedTasks, deletedTask].slice(-5);

        setTasks([...updatedTasks]);
        setCompletedTasks(updatedCompleted);

        chrome.storage.local.set({
            tasks: updatedTasks,
            completedTasks: updatedCompleted
        }, function () {
            console.log("task deleted and saved:", updatedTasks);
        });
    }

    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        chrome.storage.local.set({ tasks: updatedTasks });
    }    

    function updateTaskField(index, field, value) {
        var updatedTasks = tasks.map(function (task, i) {
            if (i === index) {
                var updatedTask = { ...task, [field]: value };
                return updatedTask;
            }
            return task;
        });

        saveTasks(updatedTasks);
    }

    useEffect(function () {
        loadTasks();
    }, []);

    function createSelect(index, field, options) {
        return React.createElement(
            "select",
            {
                value: tasks[index][field],
                onChange: function (event) {
                    updateTaskField(index, field, event.target.value);
                },
                style: {
                    width: "80px",
                    minHeight: "23px",
                    fontSize: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px"
                }
            },
            options.map(function (opt) {
                return React.createElement("option", { key: opt.value, value: opt.value }, opt.label);
            })
        );
    }

    var taskRows = [];
    var i = 0;
    while (i < tasks.length) {
        var task = tasks[i];
        var row = React.createElement(
            "tr",
            { key: i },
            React.createElement(
                "td",
                {
                    style: { 
                        width: "1px", 
                        padding: "0", 
                        textAlign: "left",
                        border: "none"
                    }
                },
                React.createElement(
                    "button",
                    {
                        onClick: (event) => {
                            const indexToDelete = parseInt(event.target.getAttribute("data-index"), 10);
                            deleteTask(indexToDelete); 
                        },
                        "data-index": i,
                        style: {
                            border: "none",
                            background: "none",
                            fontSize: "16px",
                            color: "#e97b6b",
                            cursor: "pointer",
                            marginLeft: "-15px",
                            padding: "0"
                        }
                    },
                    "✘"
                )
            ),
            React.createElement("td", null, task.name),
            React.createElement("td", null, createSelect(i, "status", [
                { value: "not started", label: "not started" },
                { value: "in progress", label: "in progress" },
                { value: "completed", label: "completed" }
            ])),
            React.createElement("td", null, createSelect(i, "priority", [
                { value: "low", label: "low" },
                { value: "medium", label: "medium" },
                { value: "high", label: "high" }
            ])),
            React.createElement("td", null, createSelect(i, "session", [
                { value: "none", label: "none" },
                { value: "session 1", label: "session 1" },
                { value: "session 2", label: "session 2" },
                { value: "session 3", label: "session 3" },
                { value: "session 4", label: "session 4" }
            ])),
            React.createElement(
                "td",
                null,
                React.createElement(
                    "button",
                    {
                        onClick: (event) => {
                            const indexToDelete = parseInt(event.target.getAttribute("data-index"), 10);
                            completeTask(indexToDelete); 
                        },
                        "data-index": i,
                        style: {
                            border: "none",
                            background: "none",
                            fontSize: "16px",
                            color: "#a3b18a",
                            cursor: "pointer",
                            marginLeft: "-4px",
                            padding: "0"
                        }
                    },
                    "✔"
                )
            )
        );
        taskRows.push(row);
        i++;
    }
    
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { className: "input-container" },
            React.createElement("input", {
                type: "text",
                value: taskInput,
                onChange: function (event) {
                    setTaskInput(event.target.value);
                },
                placeholder: "Enter a task",
                style: {
                    maxWidth: "100px",
                    height: "10px",
                    padding: "6px",
                    fontSize: "12px",
                    textAlign: "left"
                }
            }),
            React.createElement(
                "button",
                { className: "add-task-button", onClick: addTask, style: { marginTop: "5px" } },
                "add task"
            )
        ),
        React.createElement(
            "table",
            { className: "task-table" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", {
                        style: {
                            width: "1px",
                            minWidth: "0px",
                            padding: "0",
                            border: "none",
                        }
                    }),
                    React.createElement("th", { style: { width: "180px" } }, "Task"),
                    React.createElement("th", { style: { width: "85px" } }, "Status"),
                    React.createElement("th", { style: { width: "85px" } }, "Priority"),
                    React.createElement("th", { style: { width: "85px" } }, "Session"),
                    React.createElement("th", {
                        style: {
                            width: "1px",
                            minWidth: "0px",
                            padding: "0",
                            border: "none",
                        }
                    })
                )
            ),
            React.createElement("tbody", null, taskRows)
        ),
        completedTasks.length > 0 && React.createElement(
            "div",
            {
                style: {
                    left: "2.5px",
                    bottom: "5px",
                    fontSize: "10px",
                    maxWidth: "150px",
                    color: "#666"
                }
            },
            React.createElement("h4", null, "Completed Tasks:"),
            React.createElement("ul", null,
                completedTasks.map((task, index) =>
                    React.createElement("li", {
                        key: index,
                        style: {
                            textDecoration: "line-through",
                            color: "#888",
                            fontSize: "12px",
                            marginBottom: "4px"
                        }
                    }, task.name)
                )
            )
        )
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(ToDoApp));
