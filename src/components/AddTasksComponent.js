import React from 'react';

const AddTasksComponent = ({ handleAddTask, error, task, setTask, handleInputChange }) => {


    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Add New Task</h2>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-medium">
                    {error}
                </div>
            )}

            <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={task.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="text"
                name="description"
                placeholder="Task Description"
                value={task.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
                name="category"
                value={task.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
            </select>

            <select
                name="priority"
                value={task.priority}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
            </select>

            <button
                onClick={handleAddTask}
                className="w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Task
            </button>
        </div>
    );
};

export default AddTasksComponent;
