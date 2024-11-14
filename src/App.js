import { useEffect, useState } from 'react';
import './App.css';
import AddTasksComponent from './components/AddTasksComponent';
import { X, Check, Search } from 'lucide-react';
import sampleTasks from './sampleTasks.json';

const App = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [task, setTask] = useState({
    uniqueId: Date.now(),
    title: '',
    description: '',
    category: '',
    isCompleted: false,
    priority: 'Low'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddTask = () => {
    if (task.title === '' || task.description === '' || task.category === '' || task.priority === '') {
      setError("Please fill in all fields");
      return;
    }

    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = [...existingTasks, task];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setTask({
      uniqueId: Date.now(),
      title: '',
      description: '',
      category: '',
      isCompleted: false,
      priority: 'Low'
    });
    setError(null);
    fetchTasks();
    closeAddTaskModal()
  };

  const handleDeleteTask = (uniqueId) => {
    const updatedTasks = allTasks.filter(task => task.uniqueId !== uniqueId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    fetchTasks();
  };

  const fetchTasks = () => {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      setAllTasks(JSON.parse(tasks));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openAddTaskModal = () => setIsModalOpen(true);
  const closeAddTaskModal = () => setIsModalOpen(false);


  const handleSearchTasks = (searchParam) => {
    // Get tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // If search parameter is empty, return all tasks
    if (!searchParam?.trim()) {
      setAllTasks(tasks);
      return;
    }

    // Convert search parameter to lowercase for case-insensitive comparison
    const searchTerm = searchParam.toLowerCase();

    // Define field weights for scoring
    const weights = {
      title: 3,      // Title matches are most important
      description: 2, // Description matches are second most important
      category: 2,    // Category matches are equally important as description
      priority: 1     // Priority matches are least important
    };

    // Calculate score for each task
    const scoredTasks = tasks.map(task => {
      let score = 0;

      // Helper function to calculate match score
      const calculateFieldScore = (fieldValue, weight) => {
        if (!fieldValue) return 0;
        const value = fieldValue.toLowerCase();

        // Exact match gets highest score
        if (value === searchTerm) {
          return weight * 2;
        }
        // Partial match gets partial score
        if (value.includes(searchTerm)) {
          return weight;
        }
        // Words match individually
        const searchWords = searchTerm.split(' ');
        const fieldWords = value.split(' ');
        const wordMatchScore = searchWords.reduce((acc, searchWord) => {
          return acc + (fieldWords.some(fieldWord => fieldWord.includes(searchWord)) ? 0.5 : 0);
        }, 0);

        return wordMatchScore * weight;
      };

      // Calculate scores for each field
      score += calculateFieldScore(task.title, weights.title);
      score += calculateFieldScore(task.description, weights.description);
      score += calculateFieldScore(task.category, weights.category);
      score += calculateFieldScore(task.priority, weights.priority);

      return {
        ...task,
        score
      };
    });

    // Filter tasks with any match (score > 0) and sort by score
    const filteredTasks = scoredTasks
      .filter(task => task.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...task }) => task); // Remove score before returning

    setAllTasks(filteredTasks);
  };


  const handleTaskCompletion = (uniqueId) => {
    const updatedTasks = allTasks.map(task => {
      if (task.uniqueId === uniqueId) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });

    // Update localStorage and state
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
  };


  const handleAddRandomTask = () => {
    // Get a random task from sample tasks
    const randomIndex = Math.floor(Math.random() * sampleTasks.tasks.length);
    const randomTask = sampleTasks.tasks[randomIndex];

    // Generate a new unique ID for the task
    const newTask = {
      ...randomTask,
      uniqueId: Date.now(),  // Ensure unique ID for new task
      isCompleted: false     // Reset completion status
    };

    // Get existing tasks from localStorage
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Add new task to existing tasks
    const updatedTasks = [...existingTasks, newTask];

    // Update localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Update state to reflect changes
    setAllTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Center container */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Header section */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-6 mb-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 flex-shrink-0">
              Flare Manager
            </h1>

            {/* Search Bar Container */}
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks by title, description, or category..."
                onChange={(e) => handleSearchTasks(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Buttons Container */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleAddRandomTask}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md active:transform active:scale-95"
              >
                Add Random Task
              </button>

              <button
                onClick={openAddTaskModal}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md active:transform active:scale-95"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Tasks grid container */}
        <div className="flex justify-center">
          {allTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {allTasks.map((task) => (
                <div
                  key={task.uniqueId}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between ${task.isCompleted ? 'bg-gray-50' : ''
                    }`}
                >
                  <div>
                    {/* Checkbox and Title Row */}
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => handleTaskCompletion(task.uniqueId)}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors duration-200 ${task.isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                          }`}
                      >
                        {task.isCompleted && <Check size={16} />}
                      </button>
                      <h2
                        className={`text-xl font-semibold flex-1 ${task.isCompleted
                          ? 'text-gray-500 line-through'
                          : 'text-blue-600'
                          }`}
                      >
                        {task.title}
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <p className={`text-gray-700 ${task.isCompleted ? 'text-gray-500' : ''}`}>
                        <span className="font-medium">Description:</span>
                        <br />
                        <span className={`${task.isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                          {task.description}
                        </span>
                      </p>
                      <p className={`text-gray-700 ${task.isCompleted ? 'text-gray-500' : ''}`}>
                        <span className="font-medium">Category:</span>{' '}
                        <span className={`${task.isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                          {task.category}
                        </span>
                      </p>
                      <p className={`text-gray-700 ${task.isCompleted ? 'text-gray-500' : ''}`}>
                        <span className="font-medium">Priority:</span>{' '}
                        <span
                          className={`font-medium ${task.isCompleted
                            ? 'text-gray-500'
                            : task.priority === 'High'
                              ? 'text-red-600'
                              : task.priority === 'Medium'
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}
                        >
                          {task.priority}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.uniqueId)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full"
                  >
                    Delete Task
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No tasks available. Please add a new task.
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={closeAddTaskModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <AddTasksComponent
                handleAddTask={handleAddTask}
                error={error}
                task={task}
                setTask={setTask}
                handleInputChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;